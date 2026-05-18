using CafePOS.Core.Enums;

namespace CafePOS.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CashierId { get; set; }

    public User Cashier { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = [];
    public Payment? Payment { get; set; }
}
