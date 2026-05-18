using CafePOS.Core.Enums;

namespace CafePOS.Application.DTOs.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CashierName { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = [];
    public PaymentDto? Payment { get; set; }
}

public class PaymentDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public DateTime PaidAt { get; set; }
}

public class CreateOrderItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    public List<CreateOrderItemRequest> Items { get; set; } = [];
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}
