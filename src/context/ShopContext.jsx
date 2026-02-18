import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clampQty, normalizeShopItem } from "../utils/shopItem";

const ShopContext = createContext(null);

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";
const SAVED_KEY = "savedForLater";

const readLS = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const sameId = (a, b) => String(a) === String(b);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readLS(CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => readLS(WISHLIST_KEY, []));
  const [savedForLater, setSavedForLater] = useState(() => readLS(SAVED_KEY, []));

  useEffect(() => writeLS(CART_KEY, cart), [cart]);
  useEffect(() => writeLS(WISHLIST_KEY, wishlist), [wishlist]);
  useEffect(() => writeLS(SAVED_KEY, savedForLater), [savedForLater]);

  useEffect(() => {
    const sync = () => {
      setCart(readLS(CART_KEY, []));
      setWishlist(readLS(WISHLIST_KEY, []));
      setSavedForLater(readLS(SAVED_KEY, []));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0),
    [cart]
  );

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  // =========================
  // CART ACTIONS
  // =========================
  const addToCart = (product, qty = 1) => {
    const normalized = normalizeShopItem(product, qty);

    setCart((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => sameId(x.id, normalized.id));
      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          qty: clampQty((Number(copy[idx].qty) || 1) + normalized.qty),
        };
      } else {
        copy.push(normalized);
      }
      return copy;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => !sameId(x.id, id)));
  };

  const clearCart = () => setCart([]);

  const updateCartQty = (id, nextQty) => {
    setCart((prev) =>
      prev.map((x) => (sameId(x.id, id) ? { ...x, qty: clampQty(nextQty) } : x))
    );
  };

  // =========================
  // WISHLIST ACTIONS
  // =========================
  const isInWishlist = (id) => wishlist.some((x) => sameId(x.id, id));

  const addToWishlist = (product) => {
    const normalized = {
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      thumbnail: product.thumbnail,
      qty: 1,
      savedAt: Date.now(),
    };

    setWishlist((prev) => {
      const exists = prev.some((x) => sameId(x.id, normalized.id));
      if (exists) return prev;
      return [normalized, ...prev];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((x) => !sameId(x.id, id)));
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const clearWishlist = () => setWishlist([]);

  // =========================
  // SAVED FOR LATER ACTIONS (FIXED)
  // =========================
  const saveForLater = (item) => {
    const qtyToMove = clampQty(item.qty || 1);

    // ✅ Normalize once at the boundary
    const normalized = normalizeShopItem(item, qtyToMove);

    // ✅ Add/merge into saved FIRST (never lose an item)
    setSavedForLater((prev) => {
      const idx = prev.findIndex((x) => sameId(x.id, normalized.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          qty: clampQty((Number(copy[idx].qty) || 1) + normalized.qty),
          savedAt: Date.now(),
        };
        return copy;
      }
      return [{ ...normalized, savedAt: Date.now() }, ...prev];
    });

    // ✅ Then remove from cart
    setCart((prev) => prev.filter((x) => !sameId(x.id, normalized.id)));
  };

  const removeSaved = (id) => {
    setSavedForLater((prev) => prev.filter((x) => !sameId(x.id, id)));
  };

  const clearSaved = () => setSavedForLater([]);

  const moveSavedToCart = (item) => {
    const qtyToAdd = clampQty(item.qty || 1);

    // ✅ Normalize once at the boundary
    const normalized = normalizeShopItem(item, qtyToAdd);

    // ✅ Add/merge into cart FIRST (merge qty, never duplicate)
    setCart((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => sameId(x.id, normalized.id));

      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          qty: clampQty((Number(copy[idx].qty) || 1) + normalized.qty),
        };
      } else {
        copy.push(normalized);
      }

      return copy;
    });

    // ✅ Then remove from saved
    setSavedForLater((prev) => prev.filter((x) => !sameId(x.id, normalized.id)));
  };

  const value = {
    cart,
    wishlist,
    savedForLater,

    cartCount,
    wishlistCount,

    addToCart,
    removeFromCart,
    clearCart,
    updateCartQty,

    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,

    saveForLater,
    removeSaved,
    clearSaved,
    moveSavedToCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
