using CafePOS.Core.Interfaces;
using CafePOS.Infrastructure.Data;

namespace CafePOS.Infrastructure.Repositories;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    private readonly AppDbContext _context = context;

    public IUserRepository Users { get; } = new UserRepository(context);
    public ICategoryRepository Categories { get; } = new CategoryRepository(context);
    public IProductRepository Products { get; } = new ProductRepository(context);
    public IOrderRepository Orders { get; } = new OrderRepository(context);

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
