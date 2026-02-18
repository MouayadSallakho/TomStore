import React, { useEffect, useMemo, useState } from "react";
import { Container, Breadcrumb, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Offcanvas from "react-bootstrap/Offcanvas";

import {
  FaStar,
  FaRegStar,
  FaRegHeart,
  FaCartPlus,
  FaHeart,
} from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { CiGrid2H } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import "./AllProducts.css";
import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";

import { useShop } from "../../context/ShopContext"; // ✅ adjust path if needed
import { normalizeShopItem } from "../../utils/shopItem";
import { useToast } from "../../context/ToastContext";

const clampQty = (n) => Math.max(1, Math.min(99, Number(n) || 1));

const Allproducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ CONTEXT (NO localStorage here)
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { showToast } = useToast();

  // ✅ responsive: show Offcanvas filters under 992px
  const [isMobileFilters, setIsMobileFilters] = useState(
    () => window.innerWidth < 992,
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobileFilters(mobile);

      // If user resized to desktop, close the offcanvas automatically
      if (!mobile) setShowFilters(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // search from URL (desktop + mobile header)
  const [searchText, setSearchText] = useState("");

  const totalPages = Math.max(1, Math.ceil((total || 0) / displayCount));
  const from = total === 0 ? 0 : (page - 1) * displayCount + 1;
  const to = Math.min(page * displayCount, total);

  const scrollToTopOfList = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  // read "q" from URL on mount / when query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchText(q);
  }, [location.search]);

  // qty helper
  const setQty = (id, updater) => {
    setQtyById((prev) => {
      const current = Number(prev[id] ?? 1);
      let next =
        typeof updater === "function" ? updater(current) : Number(updater);
      if (Number.isNaN(next)) next = 1;
      next = clampQty(next);
      return { ...prev, [id]: next };
    });
  };

  // ✅ apply price filter
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
    const controller = new AbortController();
    const { signal } = controller;

    setCatLoading(true);
    setCatError(null);

    fetch("https://dummyjson.com/products/categories", { signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (signal.aborted) return;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setCatError(err.message || "Failed to load categories");
      })
      .finally(() => {
        if (!signal.aborted) setCatLoading(false);
      });

    return () => controller.abort();
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
    const controller = new AbortController();
    const { signal } = controller;

    setProdLoading(true);
    setProdError(null);

    const skip = (page - 1) * displayCount;

    const url = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}?limit=${displayCount}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${displayCount}&skip=${skip}`;

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (signal.aborted) return;
        setProducts(data.products || []);
        setTotal(data.total ?? 0);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setProdError(err.message || "Failed to load products");
        setProducts([]);
        setTotal(0);
      })
      .finally(() => {
        if (!signal.aborted) setProdLoading(false);
      });

    return () => controller.abort();
  }, [displayCount, selectedCategory, page]);

  // local filter results
  const filteredProducts = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();

    return products.filter((p) => {
      // search filter (from header desktop/mobile)
      if (q) {
        const title = String(p.title || "").toLowerCase();
        const category = String(p.category || "").toLowerCase();
        if (!title.includes(q) && !category.includes(q)) return false;
      }

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
        label: `Price: ${appliedPrice.min ?? "Any"} - ${
          appliedPrice.max ?? "Any"
        }`,
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

  // ✅ helper: number of filters for badge
  const filtersCount =
    (selectedCategory ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (appliedPrice.min !== null || appliedPrice.max !== null ? 1 : 0);

  // ✅ Reusable Filters UI (same for sidebar + offcanvas)
  const FiltersUI = ({ insideOffcanvas = false }) => (
    <div className={insideOffcanvas ? "filtersMobileWrap" : ""}>
      {insideOffcanvas && (
        <div className="filtersMobileTop">
          <button
            type="button"
            className="filtersClearBtn"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}

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
                  {(showAllCats ? categories : categories.slice(0, 5)).map(
                    (cat) => {
                      const value = typeof cat === "string" ? cat : cat.slug;
                      const text = typeof cat === "string" ? cat : cat.name;
                      const id = `cat-${insideOffcanvas ? "m-" : ""}${value}`;

                      return (
                        <li key={value} className="filterItem">
                          <Form.Check
                            id={id}
                            type="radio"
                            name={
                              insideOffcanvas ? "category_mobile" : "category"
                            }
                            checked={selectedCategory === value}
                            onChange={() => setSelectedCategory(value)}
                          />
                          <label htmlFor={id}>{text}</label>
                        </li>
                      );
                    },
                  )}
                </ul>

                {categories.length > 5 && (
                  <button
                    type="button"
                    className="seeMoreBtn"
                    onClick={() => setShowAllCats((v) => !v)}
                  >
                    {showAllCats
                      ? "See less"
                      : `See more (${categories.length - 5})`}
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
                <label htmlFor={insideOffcanvas ? "min-m" : "min"}>Min</label>
                <Form.Control
                  id={insideOffcanvas ? "min-m" : "min"}
                  type="number"
                  placeholder="Min"
                  value={priceMinInput}
                  onChange={(e) => setPriceMinInput(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor={insideOffcanvas ? "max-m" : "max"}>Max</label>
                <Form.Control
                  id={insideOffcanvas ? "max-m" : "max"}
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
              const id = `rating-${insideOffcanvas ? "m-" : ""}${r}`;
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
                    name={insideOffcanvas ? "rating_mobile" : "rating"}
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
            <p style={{ color: "#8B96A5", marginBottom: 0 }}>
              Static for now (UI only)
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Features</Accordion.Header>
          <Accordion.Body>
            <p style={{ color: "#8B96A5", marginBottom: 0 }}>
              Static for now (UI only)
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {insideOffcanvas && (
        <div className="filtersMobileBottom">
          <button
            type="button"
            className="filtersApplyBtn"
            onClick={() => setShowFilters(false)}
          >
            Show results
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="homePage">
      <Header />

      <div className="contentAllProd">
        <div className="SorcThePage">
          <Container>
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item as={NavLink} to="/">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item active>All Products</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>

        <div className="Content">
          <Container>
            <Row>
              {/* ✅ Desktop sidebar filters only */}
              {!isMobileFilters && (
                <Col lg={3} className="holder-fillter">
                  <FiltersUI />
                </Col>
              )}

              {/* Products */}
              <Col lg={9}>
                <div className="Product-list">
                  {/* ✅ Mobile/Tablet toolbar */}
                  {isMobileFilters && (
                    <div className="mobileToolbar">
                      <button
                        type="button"
                        className="btnMobileFilters"
                        onClick={() => setShowFilters(true)}
                      >
                        <FaFilter />
                        Filters
                        {filtersCount > 0 && (
                          <span className="filtersBadge">{filtersCount}</span>
                        )}
                      </button>

                      {filtersCount > 0 && (
                        <button
                          type="button"
                          className="btnMobileClear"
                          onClick={clearAllFilters}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}

                  <div className="Grid">
                    <p>
                      Showing <span>{filteredProducts.length}</span>{" "}
                      {searchText
                        ? `items for "${searchText}"`
                        : "items in"}{" "}
                      {!searchText && (
                        <span>
                          {selectedCategory
                            ? selectedCategory
                            : "All products"}
                        </span>
                      )}
                    </p>

                    <div className="type-grid">
                      <button
                        className="active"
                        type="button"
                        aria-label="Grid view"
                      >
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

                      <button
                        type="button"
                        className="clearAllBtn"
                        onClick={clearAllFilters}
                      >
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
                            <div  className="product-card">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="img-fluid"
                              />

                              <div className="text">
                                <div className="price">
                                  <p>
                                    <span>${product.price}</span>
                                    <span>
                                      {Math.round(product.discountPercentage)}%
                                    </span>
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
                                    onClick={() => {
                                      const already = isInWishlist(product.id);
                                      toggleWishlist(product);
                                      showToast({
                                        type: already ? "danger" : "success",
                                        title: already
                                          ? "Removed from wishlist"
                                          : "Added to wishlist",
                                        message: product.title,
                                        actionLabel: "View wishlist",
                                        actionRoute: "/wishlist",
                                      });
                                    }}
                                    aria-label="Wishlist"
                                  >
                                    {isInWishlist(product.id) ? (
                                      <FaHeart />
                                    ) : (
                                      <FaRegHeart />
                                    )}
                                  </button>
                                </div>

                                <div className="heroRating">
                                  <div className="rating">
                                    {Array.from({ length: 5 }, (_, i) =>
                                      i < Math.round(product.rating) ? (
                                        <FaStar key={i} color="#ffc107" />
                                      ) : (
                                        <FaRegStar key={i} color="#ccc" />
                                      ),
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
                                        const currentQty =
                                          qtyById[product.id] ?? 1;
                                        const normalized = normalizeShopItem(
                                          product,
                                          currentQty,
                                        );
                                        addToCart(
                                          normalized,
                                          normalized.qty,
                                        ); // ✅ normalized input to context
                                        setQty(product.id, 1);
                                        showToast({
                                          type: "success",
                                          title: "Added to cart",
                                          message: product.title,
                                          actionLabel: "View cart",
                                          actionRoute: "/Cart",
                                        });
                                      }}
                                    >
                                      <FaCartPlus className="icon" />
                                      Add
                                    </button>

                                    <NavLink
                                      to={`/product/${product.id}`}
                                      className="btnView"
                                    >
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
                        onChange={(e) =>
                          setDisplayCount(Number(e.target.value))
                        }
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
                      {total > 0
                        ? `Showing ${from}–${to} of ${total}`
                        : "No results"}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* ✅ Offcanvas Filters for Mobile/Tablet */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="end"
        className="filtersOffcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FiltersUI insideOffcanvas />
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </div>
  );
};

export default Allproducts;
