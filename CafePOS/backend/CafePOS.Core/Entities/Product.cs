namespace CafePOS.Core.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;

    public Category Category { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}
