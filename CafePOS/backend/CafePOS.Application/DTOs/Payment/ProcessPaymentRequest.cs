using CafePOS.Core.Enums;

namespace CafePOS.Application.DTOs.Payment;

public class ProcessPaymentRequest
{
    public int OrderId { get; set; }
    public PaymentMethod Method { get; set; }
    public decimal Amount { get; set; }
}
