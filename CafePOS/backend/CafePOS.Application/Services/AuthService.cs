using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using CafePOS.Application.DTOs.Auth;
using CafePOS.Application.Interfaces;
using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CafePOS.Application.Services;

public class AuthService(IUnitOfWork unitOfWork, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await unitOfWork.Users.GetByUsernameAsync(request.Username)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return new AuthResponse
        {
            Token = GenerateToken(user),
            Username = user.Username,
            Role = user.Role.ToString(),
            UserId = user.Id
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existing = await unitOfWork.Users.GetByUsernameAsync(request.Username);
        if (existing is not null)
            throw new InvalidOperationException("Username already taken.");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        await unitOfWork.Users.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateToken(user),
            Username = user.Username,
            Role = user.Role.ToString(),
            UserId = user.Id
        };
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured.")));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
