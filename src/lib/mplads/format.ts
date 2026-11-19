export function formatInrExact(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInrCrores(amount: number): string {
  return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
}

export function formatInrLakhs(amount: number): string {
  return `₹${(amount / 100_000).toFixed(2)} L`;
}
