using CafePOS.Application.DTOs.Product;
using CafePOS.Application.Interfaces;
using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;

namespace CafePOS.Application.Services;

public class ProductService(IUnitOfWork unitOfWork) : IProductService
{
    public async Task<IEnumerable<ProductDto>> GetAllAsync(int? categoryId = null)
    {
        IEnumerable<Core.Entities.Product> products = categoryId.HasValue
            ? await unitOfWork.Products.GetByCategoryAsync(categoryId.Value)
            : await unitOfWork.Products.GetAvailableAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await unitOfWork.Products.GetByIdAsync(id);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        var product = new Core.Entities.Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            ImageUrl = request.ImageUrl
        };
        await unitOfWork.Products.AddAsync(product);
        await unitOfWork.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductRequest request)
    {
        var product = await unitOfWork.Products.GetByIdAsync(id);
        if (product is null) return null;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.CategoryId = request.CategoryId;
        product.ImageUrl = request.ImageUrl;
        product.IsAvailable = request.IsAvailable;
        unitOfWork.Products.Update(product);
        await unitOfWork.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await unitOfWork.Products.GetByIdAsync(id);
        if (product is null) return false;

        product.IsAvailable = false;
        unitOfWork.Products.Update(product);
        await unitOfWork.SaveChangesAsync();
        return true;
    }

    private static ProductDto MapToDto(Core.Entities.Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name ?? string.Empty,
        ImageUrl = p.ImageUrl,
        IsAvailable = p.IsAvailable
    };
}
