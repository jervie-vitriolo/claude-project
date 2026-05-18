using CafePOS.Core.Enums;

namespace CafePOS.Core.Entities;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;

    public Order Order { get; set; } = null!;
}
