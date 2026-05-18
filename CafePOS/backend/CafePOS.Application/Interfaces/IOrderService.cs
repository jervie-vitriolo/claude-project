using CafePOS.Application.DTOs.Order;

namespace CafePOS.Application.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(int id);
    Task<OrderDto> CreateAsync(CreateOrderRequest request, int cashierId);
    Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusRequest request);
    Task<OrderDto?> ProcessPaymentAsync(int orderId, DTOs.Payment.ProcessPaymentRequest request);
}
