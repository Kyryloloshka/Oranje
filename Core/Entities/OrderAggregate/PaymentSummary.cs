namespace Core.Entities.OrderAggregate;

public class PaymentSummary
{
	public int Last4 { get; set; }
	public required string Brand { get; set; }
	public required string Expiry { get; set; }
	public int Year { get; set; }
}
