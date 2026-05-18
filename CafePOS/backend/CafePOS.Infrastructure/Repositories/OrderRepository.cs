using CafePOS.Core.Entities;
using CafePOS.Core.Interfaces;
using CafePOS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CafePOS.Infrastructure.Repositories;

public class OrderRepository(AppDbContext context) : Repository<Order>(context), IOrderRepository
{
    public async Task<Order?> GetWithDetailsAsync(int id)
        => await _dbSet
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.Cashier)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<IEnumerable<Order>> GetAllWithDetailsAsync()
        => await _dbSet
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.Cashier)
            .Include(o => o.Payment)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<string> GenerateOrderNumberAsync()
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var count = await _dbSet.CountAsync(o => o.CreatedAt.Date == DateTime.UtcNow.Date);
        return $"ORD-{today}-{(count + 1):D4}";
    }
}
