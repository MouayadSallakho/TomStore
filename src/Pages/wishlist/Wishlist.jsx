import React, { useEffect, useMemo, useState } from "react";
import "./Wishlist.css";
import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";
import { Container, Breadcrumb } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist"; // ✅ change if you want a different name

const readLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const clampQty = (n) => Math.max(1, Math.min(99, Number(n) || 1));
const sameId = (a, b) => String(a) === String(b);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => readLS(WISHLIST_KEY));
  const [cart, setCart] = useState(() => readLS(CART_KEY));

  // persist wishlist
  useEffect(() => {
    writeLS(WISHLIST_KEY, wishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  }, [wishlist]);

  // persist cart (for header badge)
  useEffect(() => {
    writeLS(CART_KEY, cart);
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // sync if another tab/page changes LS
  useEffect(() => {
    const sync = () => {
      setWishlist(readLS(WISHLIST_KEY));
      setCart(readLS(CART_KEY));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:changed", sync);
    window.addEventListener("cart:changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:changed", sync);
      window.removeEventListener("cart:changed", sync);
    };
  }, []);

  const count = useMemo(() => wishlist.length, [wishlist]);

  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((x) => !sameId(x.id, id)));
  };

  const clearAll = () => setWishlist([]);

  const moveToCart = (item) => {
    // 1) remove from wishlist
    setWishlist((prev) => prev.filter((x) => !sameId(x.id, item.id)));

    // 2) add/merge into cart
    setCart((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => sameId(x.id, item.id));
      const qtyToAdd = clampQty(item.qty || 1);

      if (idx >= 0) {
        copy[idx] = {
          ...copy[idx],
          qty: clampQty((copy[idx].qty || 1) + qtyToAdd),
        };
      } else {
        copy.push({
          id: item.id,
          title: item.title,
          price: Number(item.price) || 0,
          thumbnail: item.thumbnail,
          qty: qtyToAdd,
        });
      }
      return copy;
    });

    window.dispatchEvent(new Event("cart:changed"));
    window.dispatchEvent(new Event("wishlist:changed"));
  };

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="SorcThePage">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Wishlist</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* Title */}
      <div className="wishlistTitleBar">
        <Container className="wishlistTitleRow">
          <h2>My Wishlist ({count})</h2>

          {wishlist.length > 0 && (
            <button type="button" className="btnClearWishlist" onClick={clearAll}>
              Clear wishlist
            </button>
          )}
        </Container>
      </div>

      <div className="wishlistContent">
        <Container>
          {wishlist.length === 0 ? (
            <div className="wishlistEmpty">
              <h4>No items in your wishlist</h4>
              <p>Browse products and save your favorites here.</p>
              <NavLink to="/allproducts" className="btnBackShop">
                <FaArrowLeftLong /> Back to shop
              </NavLink>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              spaceBetween={14}
              navigation
              pagination={{ clickable: true }}
              mousewheel={{ forceToAxis: true }}
              keyboard={{ enabled: true }}
              breakpoints={{
                0: { slidesPerView: 1.1 },
                576: { slidesPerView: 2.1 },
                768: { slidesPerView: 2.6 },
                992: { slidesPerView: 3.1 },
                1200: { slidesPerView: 3.6 },
              }}
              className="wishlistSwiper"
            >
              {wishlist.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="wishCard">
                    <NavLink to={`/product/${item.id}`} className="productLink">
                      <div className="wishImg">
                        <img src={item.thumbnail} alt={item.title} />
                      </div>
                    </NavLink>

                    <div className="wishInfo">
                      <NavLink to={`/product/${item.id}`} className="productLink">
                        <p className="wishTitle" title={item.title}>
                          {item.title}
                        </p>
                      </NavLink>

                      <p className="wishPrice">${Number(item.price).toFixed(2)}</p>

                      <div className="wishActions">
                        <button
                          type="button"
                          className="btnMoveToCart"
                          onClick={() => moveToCart(item)}
                        >
                          Move to cart
                        </button>

                        <button
                          type="button"
                          className="btnRemoveWish"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
