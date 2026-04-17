export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN').format(price || 0);
}
