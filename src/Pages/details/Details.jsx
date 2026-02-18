// Details.jsx (Context Version: Add to cart + Wishlist + Related products)
// ✅ No localStorage here
// ✅ Uses ShopContext like AllProducts
// ✅ No "save for later"

import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FaRegHeart, FaStar } from "react-icons/fa";
import { FaHeart, FaCheck } from "react-icons/fa6";
import { MdOutlineVerifiedUser, MdOutlineContactEmergency } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { MdOutlineMessage } from "react-icons/md";
import { IoMdBasket } from "react-icons/io";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import "./Details.css";
import Footer from "../../assets/Componants/Footer/Footer";
import Header from "../../assets/Componants/Header/Header";

// ✅ CONTEXT
import { useShop } from "../../context/ShopContext";
import { useToast } from "../../context/ToastContext";
import { normalizeShopItem } from "../../utils/shopItem";

// fallback images
import fb1 from "../../assets/Images/imageshort1.png";
import fb2 from "../../assets/Images/imageshort2.png";
import fb3 from "../../assets/Images/imageshort3.png";
import fb4 from "../../assets/Images/imageshort4.png";
import fb5 from "../../assets/Images/imageshort5.png";

const clampQty = (n) => Math.max(1, Math.min(99, Number(n) || 1));

/* ---------------------------
   Skeleton Components
--------------------------- */

const DetailsTopSkeleton = () => {
  return (
    <div className="Detail_top">
      <div className="container">
        <div className="row">
          {/* Left images */}
          <div className="col-lg-3">
            <div className="holderMainImage detSkMain"></div>

            <div className="row detSkThumbs">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-2" key={i}>
                  <div className="detSkThumb"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle info */}
          <div className="col-lg-6">
            <div className="detSkLine w-30"></div>
            <div className="detSkLine w-90"></div>
            <div className="detSkLine w-70"></div>

            <div className="detSkPriceBox">
              <div className="detSkPriceCol">
                <div className="detSkLine w-40"></div>
                <div className="detSkLine w-60"></div>
              </div>
              <div className="detSkPriceCol">
                <div className="detSkLine w-40"></div>
                <div className="detSkLine w-50"></div>
              </div>
              <div className="detSkPriceCol">
                <div className="detSkLine w-40"></div>
                <div className="detSkLine w-50"></div>
              </div>
            </div>

            <div className="detSkTable">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="detSkTableRow" key={i}>
                  <div className="detSkLine w-40" style={{ margin: 0 }}></div>
                  <div className="detSkLine w-60" style={{ margin: 0 }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right seller */}
          <div className="col-lg-3">
            <div className="detSkSellerCard">
              <div className="detSkSellerTop">
                <div className="detSkAvatar"></div>
                <div className="detSkSellerText">
                  <div className="detSkLine w-80"></div>
                  <div className="detSkLine w-60"></div>
                </div>
              </div>

              <div className="detSkLine w-90"></div>
              <div className="detSkLine w-70"></div>
              <div className="detSkLine w-80"></div>

              <div className="detSkBtn"></div>
              <div className="detSkBtn"></div>
            </div>

            <div className="detSkSave"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedSkeleton = ({ count = 6 }) => {
  return (
    <>
      {/* Swiper skeleton (mobile/tablet) */}
      <div className="recoSwiperWrap">
        <div className="d-flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="right-Like" style={{ width: 220 }} key={i}>
              <div className="Boxx">
                <div className="image">
                  <div className="detSkThumb" style={{ width: 140, height: 110 }}></div>
                </div>
                <div className="text">
                  <div className="detSkLine w-90"></div>
                  <div className="detSkLine w-40"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid skeleton (desktop) */}
      <Row className="recoGridWrap g-3">
        {Array.from({ length: count }).map((_, i) => (
          <div className="right-Like col-lg-2" key={i}>
            <div className="Boxx">
              <div className="image">
                <div className="detSkThumb" style={{ width: "100%", height: 110 }}></div>
              </div>
              <div className="text">
                <div className="detSkLine w-90"></div>
                <div className="detSkLine w-40"></div>
              </div>
            </div>
          </div>
        ))}
      </Row>
    </>
  );
};

/* ---------------------------
   Main Component
--------------------------- */

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ CONTEXT
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [activeImg, setActiveImg] = useState("");
  const [related, setRelated] = useState([]);
  const [relLoading, setRelLoading] = useState(false);

  // ✅ UX states
  const [qty, setQty] = useState(1);
  const [addedPulse, setAddedPulse] = useState(false);

  const fallbackImgs = [fb1, fb2, fb3, fb4, fb5];

  const galleryImages = useMemo(() => {
    const apiImgs = Array.isArray(product?.images) ? product.images : [];
    const unique = Array.from(new Set(apiImgs));
    const need = Math.max(0, 6 - unique.length);
    return [...unique, ...fallbackImgs.slice(0, need)].slice(0, 6);
  }, [product]);

  const stars = useMemo(() => {
    const r = Math.round(Number(product?.rating || 0));
    return Array.from({ length: 5 }, (_, i) => i < r);
  }, [product?.rating]);

  const inStock = (product?.stock ?? 0) > 0;

  // Fetch product
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setErr(null);
    setProduct(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImg(data?.thumbnail || data?.images?.[0] || fb1);
        setQty(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((e) => {
        setErr(e.message);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch related
  useEffect(() => {
    if (!product?.category) return;

    setRelLoading(true);

    fetch(`https://dummyjson.com/products/category/${product.category}?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        const list = (data?.products || []).filter((p) => String(p.id) !== String(product.id));
        setRelated(list.slice(0, 6));
      })
      .catch(() => setRelated([]))
      .finally(() => setRelLoading(false));
  }, [product?.category, product?.id]);

  const decQty = () => setQty((q) => clampQty(q - 1));
  const incQty = () => setQty((q) => clampQty(q + 1));

  const handleAddToCart = () => {
    if (!product || !inStock) return;

    const normalized = normalizeShopItem(product, qty);
    addToCart(normalized, normalized.qty); // ✅ normalized input to context
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 850);

    setQty(1);
    showToast({
      type: "success",
      title: "Added to cart",
      message: product.title,
      actionLabel: "View cart",
      actionRoute: "/Cart",
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const willBeInWishlist = !isInWishlist(product.id);
    toggleWishlist(product); // ✅ context

    showToast({
      type: willBeInWishlist ? "success" : "danger",
      title: willBeInWishlist ? "Added to wishlist" : "Removed from wishlist",
      message: product.title,
      actionLabel: "View wishlist",
      actionRoute: "/wishlist",
    });
  };

  // Error UI
  if (err) {
    return (
      <div>
        <Header />
        <div className="SorcThePage">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item as={NavLink} to="/">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item as={NavLink} to="/allproducts">
                All Products
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Product</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>

        <Container className="py-5">
          <p style={{ color: "red" }}>{err}</p>
          <NavLink to="/allproducts">Back to products</NavLink>
        </Container>

        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="SorcThePage">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item as={NavLink} to="/">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item as={NavLink} to="/allproducts">
              All Products
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {loading ? "Loading..." : product?.title || "Product"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* TOP */}
      {loading ? (
        <DetailsTopSkeleton />
      ) : (
        product && (
          <div className="Detail_top">
            <div className="container">
              <div className="row">
                {/* Images */}
                <div className="col-lg-3">
                  <div className="holderMainImage">
                    <img src={activeImg} alt={product.title} />
                  </div>

                  <div className="row">
                    {galleryImages.map((img, idx) => (
                      <div
                        className={`col-2 ${activeImg === img ? "thumbActive" : ""}`}
                        key={img + idx}
                        onClick={() => setActiveImg(img)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setActiveImg(img);
                        }}
                      >
                        <img src={img} alt={`thumb-${idx}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main info */}
                <div className="col-lg-6 ">
                  <p>
                    <FaCheck /> {inStock ? "In stock" : "Out of stock"}
                  </p>

                  <h4>{product.title}</h4>

                  <div className="SmallInfo">
                    <div className="star">
                      <ul>
                        {stars.map((on, i) => (
                          <li key={i}>
                            <FaStar style={{ opacity: on ? 1 : 0.25 }} />
                          </li>
                        ))}
                      </ul>
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>

                    <span className="point"></span>

                    <div>
                      <MdOutlineMessage /> {product.reviews?.length ?? 0} reviews
                    </div>

                    <span className="point"></span>

                    <div>
                      <IoMdBasket /> {product.stock} in stock
                    </div>
                  </div>

                  <div className="infoAboutPrice">
                    <div>
                      <p className="active">${product.price}</p>
                      <span>Discount: {Math.round(product.discountPercentage || 0)}%</span>
                    </div>

                    <div className="middle">
                      <p>${Math.max(1, Math.round(product.price * 0.95))}</p>
                      <span>Best offer</span>
                    </div>

                    <div className="middle">
                      <p>${Math.max(1, Math.round(product.price * 0.9))}</p>
                      <span>Wholesale</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="tableDetails">
                    <div className="row g-0">
                      <div className="col-12 col-sm-4 fw-medium px-3 py-2 litl-color">
                        Brand:
                      </div>
                      <div className="col-12 col-sm-8 px-3 py-2">{product.brand || "—"}</div>
                    </div>

                    <div className="row g-0 border-top">
                      <div className="col-12 col-sm-4 fw-medium px-3 py-2 litl-color">
                        Category:
                      </div>
                      <div className="col-12 col-sm-8 px-3 py-2">{product.category}</div>
                    </div>

                    <div className="row g-0 border-top">
                      <div className="col-12 col-sm-4 fw-medium px-3 py-2 litl-color">
                        SKU:
                      </div>
                      <div className="col-12 col-sm-8 px-3 py-2">{product.sku || `#${product.id}`}</div>
                    </div>

                    <div className="row g-0 border-top">
                      <div className="col-12 col-sm-4 fw-medium px-3 py-2 litl-color">
                        Availability:
                      </div>
                      <div className="col-12 col-sm-8 px-3 py-2">
                        {inStock ? "Available" : "Not available"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Buy Box */}
                <div className="col-lg-3">
                  <div className="content">
                    <div className="RRR">
                      <img src={product.thumbnail} alt="supplier" />
                      <p>
                        Supplier <br />
                        {product.brand || "Dummy Supplier"}
                      </p>
                    </div>

                    <div className="holderSVG">
                      <p>
                        <MdOutlineVerifiedUser /> Germany, Berlin
                      </p>
                      <p>
                        <MdOutlineContactEmergency /> Verified Seller
                      </p>
                      <p>
                        <TbWorld /> Worldwide shipping
                      </p>
                    </div>

                    {/* Quantity + Add to cart */}
                    <div className="buyBox">
                      <div className="qtyRow">
                        <span className="qtyLabel">Quantity</span>

                        <div className="qtyControl">
                          <button type="button" onClick={decQty} aria-label="Decrease quantity">
                            −
                          </button>
                          <span>{qty}</span>
                          <button type="button" onClick={incQty} aria-label="Increase quantity">
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btnAddCart ${addedPulse ? "addedPulse" : ""}`}
                        onClick={handleAddToCart}
                        disabled={!inStock}
                      >
                        <IoMdBasket />
                        {inStock ? "Add to cart" : "Out of stock"}
                      </button>

                      <button
                        type="button"
                        className={`btnWishlist ${isInWishlist(product.id) ? "active" : ""}`}
                        onClick={handleToggleWishlist}
                        aria-label="Toggle wishlist"
                      >
                        {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                        {isInWishlist(product.id) ? "Saved to wishlist" : "Save to wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* BOTTOM */}
      <div className="DetailBottom">
        <div className="border-solidss">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="togiveback">
                  <Tabs defaultActiveKey="Description" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="Description" title="Description" className="firstTap">
                      {loading ? (
                        <>
                          <div className="detSkLine w-90"></div>
                          <div className="detSkLine w-80"></div>
                          <div className="detSkLine w-70"></div>
                        </>
                      ) : (
                        <>
                          <p>{product?.description}</p>
                          <ul>
                            <li>
                              <FaCheck /> Rating: {Number(product?.rating || 0).toFixed(1)}
                            </li>
                            <li>
                              <FaCheck /> Stock: {product?.stock}
                            </li>
                            <li>
                              <FaCheck /> Category: {product?.category}
                            </li>
                            <li>
                              <FaCheck /> Brand: {product?.brand || "—"}
                            </li>
                          </ul>
                        </>
                      )}
                    </Tab>

                    <Tab eventKey="Reviews" title="Reviews">
                      <p>DummyJSON doesn’t always provide real reviews.</p>
                    </Tab>

                    <Tab eventKey="Shipping" title="Shipping">
                      <p>Shipping info (UI for now).</p>
                    </Tab>

                    <Tab eventKey="About seller" title="About seller">
                      <p>Seller info (UI for now).</p>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="Recomended">
        <Container>
          <h4>Related products</h4>

          {relLoading ? (
            <RelatedSkeleton />
          ) : (
            <>
              {/* Swiper for mobile + tablet */}
              <div className="recoSwiperWrap">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={14}
                  pagination={{ clickable: true }}
                  navigation
                  preventClicks={false}
                  preventClicksPropagation={false}
                  breakpoints={{
                    0: { slidesPerView: 1.3 },
                    480: { slidesPerView: 2.1 },
                    768: { slidesPerView: 3.2 },
                    992: { slidesPerView: 4.2 },
                  }}
                >
                  {related.map((p) => (
                    <SwiperSlide key={p.id}>
                      <div className="right-Like">
                        <NavLink
                          to={`/product/${p.id}`}
                          className="Boxx"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="image">
                            <img src={p.thumbnail} alt={p.title} />
                          </div>
                          <div className="text">
                            <p>{p.title}</p>
                            <span>${p.price}</span>
                          </div>
                        </NavLink>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Grid for desktop only */}
              <Row className="recoGridWrap g-3">
                {related.map((p) => (
                  <div className="right-Like col-lg-2" key={p.id}>
                    <NavLink
                      to={`/product/${p.id}`}
                      className="Boxx"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="image">
                        <img src={p.thumbnail} alt={p.title} />
                      </div>
                      <div className="text">
                        <p>{p.title}</p>
                        <span>${p.price}</span>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </Row>
            </>
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

export default Details;
