import React, { useEffect, useMemo, useState } from "react";
import "./Wishlist.css";
import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";
import { Container, Breadcrumb, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

// Swiper (mobile only)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

// ✅ CONTEXT
import { useShop } from "../../context/ShopContext"; // adjust path if needed
import { normalizeShopItem } from "../../utils/shopItem";

const Wishlist = () => {
  // ✅ context state/actions
  const { wishlist, clearWishlist, removeFromWishlist, addToCart } = useShop();

  // ✅ screen size: Swiper under 768px
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const count = useMemo(() => wishlist.length, [wishlist]);

  const removeItem = (id) => removeFromWishlist(id);
  const clearAll = () => clearWishlist();

  const moveToCart = (item) => {
    // ✅ normalize to match shared item structure
    const normalized = normalizeShopItem(item, item.qty || 1);

    // ✅ remove from wishlist then add to cart
    removeFromWishlist(item.id);
    addToCart(normalized, normalized.qty);
  };

  const Card = ({ item }) => (
    <div className="wishCard h-100">
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
  );

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="SorcThePage">
        <Container>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item as={NavLink} to="/">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Wishlist</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* Title */}
      <div className="wishlistTitleBar">
        <Container className="wishlistTitleRow">
          <h2>My Wishlist ({count})</h2>

          {wishlist.length > 0 && (
            <button
              type="button"
              className="btnClearWishlist"
              onClick={clearAll}
            >
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
          ) : isMobile ? (
            <Swiper
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              spaceBetween={14}
              navigation
              pagination={{ clickable: true }}
              mousewheel={{ forceToAxis: true }}
              keyboard={{ enabled: true }}
              breakpoints={{
                0: { slidesPerView: 1.1 },
                480: { slidesPerView: 1.25 },
                576: { slidesPerView: 1.6 },
                680: { slidesPerView: 1.9 },
              }}
              className="wishlistSwiper"
            >
              {wishlist.map((item) => (
                <SwiperSlide key={item.id}>
                  <Card item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Row className="g-3">
              {wishlist.map((item) => (
                <Col key={item.id} lg={4} md={6}>
                  <Card item={item} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      <Container>
        <div className="banner">
          <div className="bannerContent">
            <div>
              <h4>Super discount on more than 100 USD</h4>
              <p>Have you ever finally just write dummy info</p>
            </div>

            <button className="btn btn-warning">Shop now</button>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default Wishlist;
