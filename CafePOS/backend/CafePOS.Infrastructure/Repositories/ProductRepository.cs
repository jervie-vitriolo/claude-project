using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;
using CafePOS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CafePOS.Infrastructure.Repositories;

public class ProductRepository(AppDbContext context) : Repository<Product>(context), IProductRepository
{
    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
        => await _dbSet.Include(p => p.Category)
                       .Where(p => p.CategoryId == categoryId && p.IsAvailable)
                       .ToListAsync();

    public async Task<IEnumerable<Product>> GetAvailableAsync()
        => await _dbSet.Include(p => p.Category)
                       .Where(p => p.IsAvailable)
                       .ToListAsync();
}
