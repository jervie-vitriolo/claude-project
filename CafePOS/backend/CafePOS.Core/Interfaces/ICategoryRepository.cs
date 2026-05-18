using CafePOS.Core.Entities;

namespace CafePOS.Core.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetActiveAsync();
}
