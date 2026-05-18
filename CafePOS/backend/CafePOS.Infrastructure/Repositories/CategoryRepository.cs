using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;
using CafePOS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CafePOS.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext context) : Repository<Category>(context), ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetActiveAsync()
        => await _dbSet.Where(c => c.IsActive).ToListAsync();
}
