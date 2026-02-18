// Shared helpers for cart / wishlist / saved items
// Ensures consistent item shape everywhere in the app.

export const clampQty = (n) => Math.max(1, Math.min(99, Number(n) || 1));

// Normalizes any product-like object into:
// { id, title, price: Number(price) || 0, thumbnail, qty: clampQty(qty || 1) }
export const normalizeShopItem = (input, qty = 1) => {
  if (!input) {
    return {
      id: undefined,
      title: "",
      price: 0,
      thumbnail: "",
      qty: clampQty(qty || 1),
    };
  }

  const basePrice =
    typeof input.price === "string" || typeof input.price === "number"
      ? input.price
      : input.price?.value ?? input.price;

  const rawThumb =
    input.thumbnail ||
    input.image || // defensive: if some API variant uses `image`
    (Array.isArray(input.images) ? input.images[0] : "");

  return {
    id: input.id,
    title: input.title ?? "",
    price: Number(basePrice) || 0,
    thumbnail: rawThumb || "",
    qty: clampQty(qty || input.qty || 1),
  };
};

