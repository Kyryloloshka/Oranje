using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class CartController(ICartService cartService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<Cart>> GetCartById(string id)
    {
        var cart = await cartService.GetCartAsync(id);
        return Ok(cart ?? new Cart{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Cart>> UpdateCart(Cart cart)
    {
        var updatedCart = await cartService.UpdateCartAsync(cart);
        if (updatedCart == null) return BadRequest("Problem updating the cart");

        return Ok(updatedCart);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteCart(string id)
    {
        var result = await cartService.DeleteCartAsync(id);
        if (!result) return BadRequest("Problem deleting the cart");
        return Ok();
    }
}