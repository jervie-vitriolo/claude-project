using CafePOS.Application.DTOs.Category;
using CafePOS.Application.Interfaces;
using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;

namespace CafePOS.Application.Services;

public class CategoryService(IUnitOfWork unitOfWork) : ICategoryService
{
    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await unitOfWork.Categories.GetActiveAsync();
        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        return category is null ? null : MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Description = request.Description
        };
        await unitOfWork.Categories.AddAsync(category);
        await unitOfWork.SaveChangesAsync();
        return MapToDto(category);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryRequest request)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        if (category is null) return null;

        category.Name = request.Name;
        category.Description = request.Description;
        category.IsActive = request.IsActive;
        unitOfWork.Categories.Update(category);
        await unitOfWork.SaveChangesAsync();
        return MapToDto(category);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        if (category is null) return false;

        category.IsActive = false;
        unitOfWork.Categories.Update(category);
        await unitOfWork.SaveChangesAsync();
        return true;
    }

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        IsActive = c.IsActive
    };
}
