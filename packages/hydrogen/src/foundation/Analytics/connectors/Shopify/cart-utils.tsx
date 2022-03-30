export function stripGId(text: string): string {
  return text.substring(text.lastIndexOf('/') + 1);
}

export function formatCartProductsData(cartLines: any[], cart: any): any[] {
  let products: any[] = [];
  const cartItems = flattenCartLines(cart.lines.edges);
  cartLines.forEach((product) => {
    const variant = cartItems[product.merchandiseId];
    products.push({
      product_gid: variant.product.product_gid,
      name: variant.product.title,
      brand: variant.product.vendor,
      variant_gid: variant.id,
      variant: variant.title,
      quantity: product.quantity,
      price: variant.priceV2.amount,
      currency: variant.priceV2.currencyCode,
    });
  });
  return products;
}

export function flattenCartLines(lines: any): Record<string, any> {
  const products: Record<string, any> = {};
  lines.forEach((line: any) => {
    const product: any = line.node.merchandise;
    products[product.id] = product;
  });
  return products;
}

export function formatProductsData(products: any): any {
  products.forEach((product: any) => {
    product.id = stripGId(product.product_gid);
    product.variant_id = stripGId(product.variant_gid);
  });
  return products;
}
