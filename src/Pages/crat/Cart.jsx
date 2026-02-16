import React, { useEffect, useMemo, useState } from "react";
import "./Cart.css";
import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";
import { Container, Col, Row, Breadcrumb } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaArrowLeftLong, FaLock, FaTruck } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import payment1 from "../../assets/Images/payment1.png";
import payment2 from "../../assets/Images/payment2.png";
import payment3 from "../../assets/Images/payment3.png";
import payment4 from "../../assets/Images/payment4.png";
import payment5 from "../../assets/Images/payment5.png";

const CART_KEY = "cart";
const SAVED_KEY = "savedForLater";

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

// ✅ avoid id type issues: "5" vs 5
const sameId = (a, b) => String(a) === String(b);

const Cart = () => {
  // ✅ init from localStorage
  const [cart, setCart] = useState(() => readLS(CART_KEY));
  const [saved, setSaved] = useState(() => readLS(SAVED_KEY));

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // ✅ persist cart
  useEffect(() => {
    writeLS(CART_KEY, cart);
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ✅ persist saved
  useEffect(() => {
    writeLS(SAVED_KEY, saved);
    window.dispatchEvent(new Event("savedUpdated"));
  }, [saved]);

  // ✅ optional sync (if another page changes LS while cart is open)
  useEffect(() => {
    const sync = () => {
      setCart(readLS(CART_KEY));
      setSaved(readLS(SAVED_KEY));
    };

    window.addEventListener("cart:changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cart:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const itemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 1), 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.qty || 1),
        0,
      ),
    [cart],
  );

  const discount = useMemo(() => {
    if (!couponApplied) return 0;
    return subtotal * 0.05; // 5%
  }, [subtotal, couponApplied]);

  const tax = useMemo(() => subtotal * 0.01, [subtotal]); // 1%

  const total = useMemo(() => {
    const t = subtotal - discount + tax;
    return t < 0 ? 0 : t;
  }, [subtotal, discount, tax]);

  const updateQty = (id, nextQty) => {
    setCart((prev) =>
      prev.map((item) =>
        sameId(item.id, id) ? { ...item, qty: clampQty(nextQty) } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => !sameId(item.id, id)));
  };

  const removeAll = () => setCart([]);

  // ✅ Cart -> Saved
  const saveForLater = (item) => {
    // remove from cart
    setCart((prev) => prev.filter((x) => !sameId(x.id, item.id)));

    // add to saved (no duplicates)
    setSaved((prev) => {
      const exists = prev.some((x) => sameId(x.id, item.id));
      if (exists) return prev;
      return [{ ...item, savedAt: Date.now() }, ...prev];
    });

    window.dispatchEvent(new Event("savedUpdated"));
  };

  const removeSaved = (id) => {
    setSaved((prev) => prev.filter((x) => !sameId(x.id, id)));
  };

  const clearSaved = () => setSaved([]);

  // ✅ Saved -> Cart (FIXED)
  const moveToCart = (item) => {
    // 1) remove from saved
    setSaved((prev) => prev.filter((x) => !sameId(x.id, item.id)));

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

    // optional event for Header badge
    window.dispatchEvent(new Event("cart:changed"));
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponApplied(false);
      return;
    }
    setCouponApplied(true);
  };

  return (
    <div>
      <Header />

      {/* Breadcrumb / Title */}
      <div className="SorcThePage">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>My Cart</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <div className="cartTitleBar">
        <Container>
          <h2>My Cart ({itemsCount})</h2>
        </Container>
      </div>

      <div className="cartContent">
        <Container>
          <Row className="g-4">
            {/* LEFT */}
            <Col lg={8}>
              <div className="cartLeftCard">
                {cart.length === 0 ? (
                  <div className="emptyCart">
                    <h4>Your cart is empty</h4>
                    <p>Add products to start your order.</p>
                    <NavLink to="/allproducts" className="btnBackShop">
                      <FaArrowLeftLong /> Back to shop
                    </NavLink>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div className="cartItem" key={item.id}>
                        <NavLink
                          to={`/product/${item.id}`}
                          className="cartProductLink"
                        >
                          <div className="cartItemImg">
                            <img src={item.thumbnail} alt={item.title} />
                          </div>
                        </NavLink>

                        <div className="cartItemBody">
                          <div className="cartItemInfo">
                            <NavLink
                              to={`/product/${item.id}`}
                              className="cartProductLink"
                            >
                              <h5 title={item.title}>{item.title}</h5>
                            </NavLink>

                            <p className="cartMeta">
                              <span>ID: #{item.id}</span>
                              <span className="dot" />
                              <span>Secure checkout</span>
                            </p>

                            <div className="cartItemActions">
                              <button
                                type="button"
                                className="btnGhostDanger"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </button>

                              <button
                                type="button"
                                className="btnGhost"
                                onClick={() => saveForLater(item)}
                              >
                                Save for later
                              </button>
                            </div>
                          </div>

                          <div className="cartItemSide">
                            <p className="cartPrice">
                              ${Number(item.price).toFixed(2)}
                            </p>

                            <div className="qtyControl">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.id, (item.qty || 1) - 1)
                                }
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>

                              <input
                                type="number"
                                value={item.qty || 1}
                                min={1}
                                max={99}
                                onChange={(e) =>
                                  updateQty(item.id, e.target.value)
                                }
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.id, (item.qty || 1) + 1)
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <p className="lineTotal">
                              $
                              {(Number(item.price) * (item.qty || 1)).toFixed(
                                2,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="cartBottomActions">
                      <NavLink to="/allproducts" className="btnBackShop">
                        <FaArrowLeftLong /> Back to shop
                      </NavLink>

                      <button
                        type="button"
                        className="btnDanger"
                        onClick={removeAll}
                      >
                        Remove all
                      </button>
                    </div>
                  </>
                )}

                {/* ✅ Saved for later */}
                <div className="savedBox">
                  <div className="savedHeader">
                    <h4>Saved for later ({saved.length})</h4>

                    {saved.length > 0 && (
                      <button
                        type="button"
                        className="btnClearSaved"
                        onClick={clearSaved}
                      >
                        Clear saved
                      </button>
                    )}
                  </div>

                  {saved.length === 0 ? (
                    <p className="savedEmpty">No saved items yet.</p>
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
  className="savedSwiper"
>
  {saved.map((item) => (
    <SwiperSlide key={item.id}>
      <div className="savedCard">
        <NavLink to={`/product/${item.id}`} className="cartProductLink">
          <div className="savedImg">
            <img src={item.thumbnail} alt={item.title} />
          </div>
        </NavLink>

        <div className="savedInfo">
          <NavLink to={`/product/${item.id}`} className="cartProductLink">
            <p className="savedTitle" title={item.title}>
              {item.title}
            </p>
          </NavLink>

          <p className="savedPrice">${Number(item.price).toFixed(2)}</p>

          <div className="savedActions">
            <button
              type="button"
              className="btnMoveToCart"
              onClick={() => moveToCart(item)}
            >
              Move to cart
            </button>

            <button
              type="button"
              className="btnRemoveSaved"
              onClick={() => removeSaved(item.id)}
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
                </div>
              </div>
            </Col>

            {/* RIGHT */}
            <Col lg={4}>
              <div className="cartRightSticky">
                <div className="cartRightStack">
                  <div className="couponCard">
                    <p className="couponTitle">Have a coupon?</p>
                    <div className="couponRow">
                      <input
                        placeholder="Add coupon"
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                      <button type="button" onClick={applyCoupon}>
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="couponApplied">Coupon applied ✅</p>
                    )}
                  </div>

                  <div className="summaryCard">
                    <div className="summaryRow">
                      <p>Subtotal</p>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="summaryRow">
                      <p>Discount</p>
                      <span className={discount > 0 ? "minus" : ""}>
                        - ${discount.toFixed(2)}
                      </span>
                    </div>

                    <div className="summaryRow">
                      <p>Tax</p>
                      <span>+ ${tax.toFixed(2)}</span>
                    </div>

                    <div className="summaryDivider" />

                    <div className="summaryRow total">
                      <p>Total</p>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <NavLink
                      to="/checkout"
                      className={`btnCheckout ${
                        cart.length === 0 ? "disabled" : ""
                      }`}
                      onClick={(e) => {
                        if (cart.length === 0) e.preventDefault();
                      }}
                    >
                      Checkout
                    </NavLink>

                    <div className="paymentImgs">
                      <img src={payment1} alt="payment1" />
                      <img src={payment2} alt="payment2" />
                      <img src={payment3} alt="payment3" />
                      <img src={payment4} alt="payment4" />
                      <img src={payment5} alt="payment5" />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Guarantee */}
      <div className="cartGuarantee">
        <Container>
          <div className="gBox">
            <div className="gIcon">
              <FaLock />
            </div>
            <div>
              <p>Secure payment</p>
              <span>Your payment details are protected.</span>
            </div>
          </div>

          <div className="gBox">
            <div className="gIcon">
              <MdMessage />
            </div>
            <div>
              <p>Customer support</p>
              <span>We’re here to help 24/7.</span>
            </div>
          </div>

          <div className="gBox">
            <div className="gIcon">
              <FaTruck />
            </div>
            <div>
              <p>Fast delivery</p>
              <span>Reliable shipping worldwide.</span>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
