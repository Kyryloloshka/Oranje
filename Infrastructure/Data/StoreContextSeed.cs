using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;

namespace Infrastructure.Data;
public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context) {
        if (!context.Products.Any()) {
            var productsData = System.IO.File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
            var products = JsonSerializer.Deserialize<List<Product>>(productsData);
            if (products == null) return;
            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
        if (!context.DeliveryMethods.Any()) {
            var dmData = System.IO.File.ReadAllText("../Infrastructure/Data/SeedData/delivery.json");
            var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);
            if (methods == null) return;
            context.DeliveryMethods.AddRange(methods);
            await context.SaveChangesAsync();
        }
    }
}