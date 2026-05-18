using CafePOS.Application.DTOs.Order;
using CafePOS.Application.DTOs.Payment;
using CafePOS.Application.Interfaces;
using CafePOS.Core.Entities;
using CafePOS.Core.Enums;
using CafePOS.Core.Interfaces;

namespace CafePOS.Application.Services;

public class OrderService(IUnitOfWork unitOfWork) : IOrderService
{
    public async Task<IEnumerable<OrderDto>> GetAllAsync()
    {
        var orders = await unitOfWork.Orders.GetAllWithDetailsAsync();
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await unitOfWork.Orders.GetWithDetailsAsync(id);
        return order is null ? null : MapToDto(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderRequest request, int cashierId)
    {
        var orderNumber = await unitOfWork.Orders.GenerateOrderNumberAsync();
        var order = new Order
        {
            OrderNumber = orderNumber,
            CashierId = cashierId,
            Status = OrderStatus.Pending
        };

        decimal total = 0;
        foreach (var item in request.Items)
        {
            var product = await unitOfWork.Products.GetByIdAsync(item.ProductId)
                ?? throw new InvalidOperationException($"Product {item.ProductId} not found.");

            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            };
            order.OrderItems.Add(orderItem);
            total += product.Price * item.Quantity;
        }

        order.TotalAmount = total;
        await unitOfWork.Orders.AddAsync(order);
        await unitOfWork.SaveChangesAsync();

        var created = await unitOfWork.Orders.GetWithDetailsAsync(order.Id);
        return MapToDto(created!);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusRequest request)
    {
        var order = await unitOfWork.Orders.GetByIdAsync(id);
        if (order is null) return null;

        order.Status = request.Status;
        unitOfWork.Orders.Update(order);
        await unitOfWork.SaveChangesAsync();

        var updated = await unitOfWork.Orders.GetWithDetailsAsync(id);
        return MapToDto(updated!);
    }

    public async Task<OrderDto?> ProcessPaymentAsync(int orderId, ProcessPaymentRequest request)
    {
        var order = await unitOfWork.Orders.GetWithDetailsAsync(orderId);
        if (order is null) return null;
        if (order.Payment is not null)
            throw new InvalidOperationException("Order already paid.");

        var payment = new Payment
        {
            OrderId = orderId,
            Amount = request.Amount,
            Method = request.Method
        };

        order.Status = OrderStatus.Completed;
        order.Payment = payment;
        unitOfWork.Orders.Update(order);
        await unitOfWork.SaveChangesAsync();

        var updated = await unitOfWork.Orders.GetWithDetailsAsync(orderId);
        return MapToDto(updated!);
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        Status = o.Status,
        TotalAmount = o.TotalAmount,
        CreatedAt = o.CreatedAt,
        CashierName = o.Cashier?.Username ?? string.Empty,
        Items = o.OrderItems.Select(oi => new OrderItemDto
        {
            Id = oi.Id,
            ProductId = oi.ProductId,
            ProductName = oi.Product?.Name ?? string.Empty,
            Quantity = oi.Quantity,
            UnitPrice = oi.UnitPrice,
            Subtotal = oi.UnitPrice * oi.Quantity
        }).ToList(),
        Payment = o.Payment is null ? null : new PaymentDto
        {
            Id = o.Payment.Id,
            Amount = o.Payment.Amount,
            Method = o.Payment.Method.ToString(),
            PaidAt = o.Payment.PaidAt
        }
    };
}
