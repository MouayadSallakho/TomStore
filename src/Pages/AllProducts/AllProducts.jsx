import React, { useEffect, useMemo, useState } from "react";
import { Container, Breadcrumb, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { FaStar, FaRegStar, FaRegHeart, FaCartPlus, FaHeart } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { CiGrid2H } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

import "./AllProducts.css";
import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const clampQty = (n) => Math.max(1, Math.min(99, Number(n) || 1));
const sameId = (a, b) => String(a) === String(b);

const Allproducts = () => {
  const navigate = useNavigate();

  // pagination
  const [displayCount, setDisplayCount] = useState(10);
  const [page, setPage] = useState(1);

  // api data
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  // qty per product
  const [qtyById, setQtyById] = useState({});

  // categories
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);
  const [showAllCats, setShowAllCats] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // products loading/error
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState(null);

  // filters
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const [appliedPrice, setAppliedPrice] = useState({ min: null, max: null });
  const [minRating, setMinRating] = useState(0);

  // wishlist (localStorage)
  const [wishlist, setWishlist] = useState(() => readJSON(WISHLIST_KEY, []));

  // toast
  const [toast, setToast] = useState({
    open: false,
    text: "",
    productTitle: "",
    action: "cart", // "cart" | "wishlist"
  });

  const totalPages = Math.max(1, Math.ceil((total || 0) / displayCount));
  const from = total === 0 ? 0 : (page - 1) * displayCount + 1;
  const to = Math.min(page * displayCount, total);

  const scrollToTopOfList = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const openToast = (text, productTitle = "", action = "cart") => {
    setToast({ open: true, text, productTitle, action });
    window.clearTimeout(openToast._t);
    openToast._t = window.setTimeout(() => {
      setToast({ open: false, text: "", productTitle: "", action: "cart" });
    }, 2500);
  };

  // persist wishlist + notify header
  useEffect(() => {
    writeJSON(WISHLIST_KEY, wishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  }, [wishlist]);

  // qty helper
  const setQty = (id, updater) => {
    setQtyById((prev) => {
      const current = Number(prev[id] ?? 1);
      let next = typeof updater === "function" ? updater(current) : Number(updater);
      if (Number.isNaN(next)) next = 1;
      next = clampQty(next);
      return { ...prev, [id]: next };
    });
  };

  // ✅ add to cart (localStorage)
  const addToCart = (product, qty = 1) => {
    const cart = readJSON(CART_KEY, []);

    const normalized = {
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      thumbnail: product.thumbnail,
      qty: clampQty(qty),
    };

    const idx = cart.findIndex((x) => sameId(x.id, normalized.id));
    if (idx >= 0) {
      cart[idx].qty = clampQty((Number(cart[idx].qty) || 1) + normalized.qty);
    } else {
      cart.push(normalized);
    }

    writeJSON(CART_KEY, cart);

    // 🔥 notify header badge (if you listen to it)
    window.dispatchEvent(new Event("cart:changed"));

    openToast("Added to cart", product.title, "cart");
  };

  // ✅ wishlist helpers
  const isInWishlist = (id) => wishlist.some((x) => sameId(x.id, id));

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((x) => !sameId(x.id, product.id)));
      window.dispatchEvent(new Event("wishlist:changed"));
      openToast("Removed from wishlist", product.title, "wishlist");
      return;
    }

    const normalized = {
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      thumbnail: product.thumbnail,
      qty: 1,
      savedAt: Date.now(),
    };

    setWishlist((prev) => [normalized, ...prev]);
    window.dispatchEvent(new Event("wishlist:changed"));
    openToast("Added to wishlist", product.title, "wishlist");
  };

  // apply price filter
  const applyPriceFilter = () => {
    const min = priceMinInput === "" ? null : Number(priceMinInput);
    const max = priceMaxInput === "" ? null : Number(priceMaxInput);

    setAppliedPrice({
      min: Number.isNaN(min) ? null : min,
      max: Number.isNaN(max) ? null : max,
    });
  };

  // clear filters
  const clearCategory = () => setSelectedCategory("");
  const clearRating = () => setMinRating(0);
  const clearPrice = () => {
    setAppliedPrice({ min: null, max: null });
    setPriceMinInput("");
    setPriceMaxInput("");
  };
  const clearAllFilters = () => {
    clearCategory();
    clearRating();
    clearPrice();
  };

  // fetch categories
  useEffect(() => {
    setCatLoading(true);
    setCatError(null);

    fetch("https://dummyjson.com/products/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => setCatError(err.message))
      .finally(() => setCatLoading(false));
  }, []);

  // reset page when page size changes
  useEffect(() => {
    setPage(1);
  }, [displayCount]);

  // reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  // fetch products
  useEffect(() => {
    setProdLoading(true);
    setProdError(null);

    const skip = (page - 1) * displayCount;

    const url = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}?limit=${displayCount}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${displayCount}&skip=${skip}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total ?? 0);
      })
      .catch((err) => {
        setProdError(err.message);
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setProdLoading(false));
  }, [displayCount, selectedCategory, page]);

  // local filter results
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (minRating > 0 && Number(p.rating) < minRating) return false;

      const price = Number(p.price);
      if (appliedPrice.min !== null && price < appliedPrice.min) return false;
      if (appliedPrice.max !== null && price > appliedPrice.max) return false;

      return true;
    });
  }, [products, minRating, appliedPrice]);

  // chips
  const appliedFilters = useMemo(() => {
    const chips = [];
    if (selectedCategory) {
      chips.push({
        key: "category",
        label: `Category: ${selectedCategory}`,
        onRemove: clearCategory,
      });
    }
    if (appliedPrice.min !== null || appliedPrice.max !== null) {
      chips.push({
        key: "price",
        label: `Price: ${appliedPrice.min ?? "Any"} - ${appliedPrice.max ?? "Any"}`,
        onRemove: clearPrice,
      });
    }
    if (minRating > 0) {
      chips.push({
        key: "rating",
        label: `Rating: ${minRating}+`,
        onRemove: clearRating,
      });
    }
    return chips;
  }, [selectedCategory, appliedPrice, minRating]);

  // pagination
  const goPrev = () => {
    setPage((p) => Math.max(1, p - 1));
    scrollToTopOfList();
  };

  const goNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
    scrollToTopOfList();
  };

  const toastRoute = toast.action === "wishlist" ? "/wishlist" : "/Cart";
  const toastBtnLabel = toast.action === "wishlist" ? "Go to wishlist" : "Go to cart";

  return (
    <div className="homePage">
      <Header />

      <div className="contentAllProd">
        <div className="SorcThePage">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>All Products</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>

        <div className="Content">
          <Container>
            <Row>
              {/* Filters */}
              <Col lg={3} className="holder-fillter">
                <Accordion defaultActiveKey="0">
                  {/* Category */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Category</Accordion.Header>
                    <Accordion.Body>
                      {catLoading && (
                        <ul className="filterList">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <li key={`cat-sk-${i}`} className="filterItem catSkItem">
                              <span className="catSkRadio"></span>
                              <span className="catSkLine"></span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {catError && <p className="filterState error">{catError}</p>}

                      {!catLoading && !catError && (
                        <>
                          <ul className="filterList">
                            {(showAllCats ? categories : categories.slice(0, 5)).map((cat) => {
                              const value = typeof cat === "string" ? cat : cat.slug;
                              const text = typeof cat === "string" ? cat : cat.name;
                              const id = `cat-${value}`;

                              return (
                                <li key={value} className="filterItem">
                                  <Form.Check
                                    id={id}
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === value}
                                    onChange={() => setSelectedCategory(value)}
                                  />
                                  <label htmlFor={id}>{text}</label>
                                </li>
                              );
                            })}
                          </ul>

                          {categories.length > 5 && (
                            <button
                              type="button"
                              className="seeMoreBtn"
                              onClick={() => setShowAllCats((v) => !v)}
                            >
                              {showAllCats ? "See less" : `See more (${categories.length - 5})`}
                            </button>
                          )}
                        </>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Price */}
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Price range</Accordion.Header>
                    <Accordion.Body>
                      <div className="hold-range">
                        <div>
                          <label htmlFor="min">Min</label>
                          <Form.Control
                            id="min"
                            type="number"
                            placeholder="Min"
                            value={priceMinInput}
                            onChange={(e) => setPriceMinInput(e.target.value)}
                          />
                        </div>

                        <div>
                          <label htmlFor="max">Max</label>
                          <Form.Control
                            id="max"
                            type="number"
                            placeholder="Max"
                            value={priceMaxInput}
                            onChange={(e) => setPriceMaxInput(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={applyPriceFilter}
                      >
                        Apply
                      </button>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Rating */}
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Ratings</Accordion.Header>
                    <Accordion.Body>
                      {[5, 4, 3, 2, 1].map((r) => {
                        const id = `rating-${r}`;
                        return (
                          <div
                            key={r}
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            <Form.Check
                              id={id}
                              type="radio"
                              name="rating"
                              checked={minRating === r}
                              onChange={() => setMinRating(r)}
                            />
                            <label htmlFor={id} style={{ cursor: "pointer" }}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <CiStar key={i} style={{ opacity: i < r ? 1 : 0.3 }} />
                              ))}
                              <span style={{ marginLeft: 6 }}>{r} & up</span>
                            </label>
                          </div>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Static sections */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Brands</Accordion.Header>
                    <Accordion.Body>
                      <p style={{ color: "#8B96A5", marginBottom: 0 }}>Static for now (UI only)</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Features</Accordion.Header>
                    <Accordion.Body>
                      <p style={{ color: "#8B96A5", marginBottom: 0 }}>Static for now (UI only)</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>

              {/* Products */}
              <Col lg={9}>
                <div className="Product-list">
                  <div className="Grid">
                    <p>
                      Showing <span>{filteredProducts.length}</span> items in{" "}
                      <span>{selectedCategory ? selectedCategory : "All products"}</span>
                    </p>

                    <div className="type-grid">
                      <button className="active" type="button" aria-label="Grid view">
                        <BsGrid3X3GapFill />
                      </button>
                      <button type="button" aria-label="List view (UI only)">
                        <CiGrid2H />
                      </button>
                    </div>
                  </div>

                  {appliedFilters.length > 0 && (
                    <div className="appliedFiltersBar">
                      <div className="appliedFiltersLeft">
                        {appliedFilters.map((f) => (
                          <button
                            key={f.key}
                            type="button"
                            className="filterChip"
                            onClick={f.onRemove}
                            title="Remove filter"
                          >
                            <span>{f.label}</span>
                            <span className="x">×</span>
                          </button>
                        ))}
                      </div>

                      <button type="button" className="clearAllBtn" onClick={clearAllFilters}>
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Skeleton */}
                  {prodLoading && (
                    <Row className="g-4">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <Col lg={4} md={6} sm={6} key={`prod-sk-${i}`}>
                          <div className="product-card prodSkCard">
                            <div className="prodSkImg"></div>
                            <div className="text">
                              <div className="prodSkRow"></div>
                              <div className="prodSkStars"></div>
                              <div className="prodSkTitle"></div>
                              <div className="prodSkBtns"></div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}

                  {prodError && <p style={{ color: "red" }}>{prodError}</p>}

                  {!prodLoading && !prodError && (
                    <Row className="g-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <Col lg={4} md={6} sm={6} key={product.id}>
                            <div className="product-card">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="img-fluid"
                              />

                              <div className="text">
                                <div className="price">
                                  <p>
                                    <span>${product.price}</span>
                                    <span>{Math.round(product.discountPercentage)}%</span>
                                  </p>

                                  <button
                                    type="button"
                                    className={`wishBox ${
                                      isInWishlist(product.id) ? "active" : ""
                                    }`}
                                    title={
                                      isInWishlist(product.id)
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                    }
                                    onClick={() => toggleWishlist(product)}
                                    aria-label="Wishlist"
                                  >
                                    {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                                  </button>
                                </div>

                                <div className="heroRating">
                                  <div className="rating">
                                    {Array.from({ length: 5 }, (_, i) =>
                                      i < Math.round(product.rating) ? (
                                        <FaStar key={i} color="#ffc107" />
                                      ) : (
                                        <FaRegStar key={i} color="#ccc" />
                                      )
                                    )}
                                  </div>
                                  <p>{Number(product.rating).toFixed(1)}</p>
                                </div>

                                <h6>{product.title}</h6>

                                <div className="cardActions">
                                  <div className="actionBtns">
                                    <button
                                      type="button"
                                      className="btnAddCart"
                                      onClick={() => {
                                        const currentQty = qtyById[product.id] ?? 1;
                                        addToCart(product, currentQty);
                                        setQty(product.id, 1);
                                      }}
                                    >
                                      <FaCartPlus className="icon" />
                                      Add
                                    </button>

                                    <NavLink to={`/product/${product.id}`} className="btnView">
                                      <FiEye className="icon" />
                                      View
                                    </NavLink>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        ))
                      ) : (
                        <p>No products match your filters.</p>
                      )}
                    </Row>
                  )}

                  {/* Footer Bar */}
                  <div className="listFooterBar">
                    <div className="pageSize">
                      <span>Show</span>
                      <Form.Select
                        value={displayCount}
                        onChange={(e) => setDisplayCount(Number(e.target.value))}
                        className="pageSizeSelect"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </Form.Select>
                      <span>per page</span>
                    </div>

                    <div className="pager">
                      <button
                        type="button"
                        className="pagerBtn"
                        disabled={page <= 1 || prodLoading}
                        onClick={goPrev}
                      >
                        Prev
                      </button>

                      <div className="pagerInfo">
                        Page <b>{page}</b> of <b>{totalPages}</b>
                      </div>

                      <button
                        type="button"
                        className="pagerBtn"
                        disabled={page >= totalPages || prodLoading}
                        onClick={goNext}
                      >
                        Next
                      </button>
                    </div>

                    <div className="rangeInfo">
                      {total > 0 ? `Showing ${from}–${to} of ${total}` : "No results"}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Toast */}
      {toast.open && (
        <div className="cartToast" role="status" aria-live="polite">
          <div className="cartToastInner">
            <div className="cartToastText">
              <b>{toast.text}</b>
              {toast.productTitle ? <span className="small"> {toast.productTitle}</span> : null}
            </div>

            <div className="cartToastActions">
              <button type="button" className="toastBtn" onClick={() => navigate(toastRoute)}>
                {toastBtnLabel}
              </button>

              <button
                type="button"
                className="toastX"
                onClick={() => setToast({ open: false, text: "", productTitle: "", action: "cart" })}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Allproducts;
