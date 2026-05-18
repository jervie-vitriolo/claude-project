using System.Security.Claims;
using CafePOS.Application.DTOs.Order;
using CafePOS.Application.DTOs.Payment;
using CafePOS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CafePOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await orderService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await orderService.GetByIdAsync(id);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        var cashierId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var created = await orderService.CreateAsync(request, cashierId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var updated = await orderService.UpdateStatusAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpPost("{id}/payment")]
    public async Task<IActionResult> ProcessPayment(int id, [FromBody] ProcessPaymentRequest request)
    {
        var updated = await orderService.ProcessPaymentAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }
}
