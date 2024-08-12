using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces;
public interface ICartService
{
    Task<Cart?> GetCartAsync(string cartId);
    Task<Cart?> UpdateCartAsync(Cart cart);
    Task<bool> DeleteCartAsync(string cartId);
    
}