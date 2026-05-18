using CafePOS.Core.Entities;

namespace CafePOS.Core.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetWithDetailsAsync(int id);
    Task<IEnumerable<Order>> GetAllWithDetailsAsync();
    Task<string> GenerateOrderNumberAsync();
}
