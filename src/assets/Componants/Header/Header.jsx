import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { MdMessage } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

import "../Header/Header.css";

// ✅ CONTEXT
import { useShop } from "../../../context/ShopContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get counts from Context
  const { cartCount, wishlistCount } = useShop();

  // Desktop (secondLine) Offcanvas
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Mobile Offcanvas
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openMobileMenu = () => setMobileMenuOpen(true);

  // ✅ SEARCH STATE
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  // Suggestions dropdown refs (for outside-click close)
  const suggestWrapRef = useRef(null);

  // ✅ helper: render badge without changing your CSS
  const Badge = ({ value }) => {
    if (!value || value <= 0) return null;

    return (
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-8px",
          minWidth: "18px",
          height: "18px",
          padding: "0 6px",
          borderRadius: "999px",
          background: "#FA3434",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {value > 99 ? "99+" : value}
      </span>
    );
  };

  // ✅ Debounced live suggestions (desktop)
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const q = searchText.trim();

    if (q.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    const t = setTimeout(() => {
      fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          q,
        )}&limit=6`,
        { signal },
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to search products");
          return res.json();
        })
        .then((data) => {
          if (signal.aborted) return;
          setSuggestions(Array.isArray(data?.products) ? data.products : []);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!signal.aborted) setSearchLoading(false);
        });
    }, 350);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [searchText]);

  // ✅ Close suggestions on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!showSuggest) return;
      if (!suggestWrapRef.current) return;
      if (!suggestWrapRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [showSuggest]);

  // ✅ Submit search => go to all products with query
  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;

    setShowSuggest(false);
    navigate(`/allproducts?q=${encodeURIComponent(q)}`);
  };

  // ✅ Click suggestion => go to product details
  const goToProduct = (id) => {
    setShowSuggest(false);
    setSearchText("");
    setSuggestions([]);
    navigate(`/product/${id}`);
  };

  // ✅ "View all results" button (NO fake Event)
  const viewAllResults = () => {
    const q = searchText.trim();
    if (!q) return;
    setShowSuggest(false);
    navigate(`/allproducts?q=${encodeURIComponent(q)}`);
  };

  // ✅ Active class helper for HOME:
  // If your home route is "/", it will be active only when pathname === "/"
  const isHomeActive = location.pathname === "/";

  // ✅ Common nav links (use same on desktop + mobile)
  const NavLinks = ({ onClick }) => {
    return (
      <>
        <NavLink
          to="/"
          end
          onClick={onClick}
          className={({ isActive }) =>
            isActive || isHomeActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/allproducts"
          onClick={onClick}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Our Products
        </NavLink>

        <NavLink
          to="/contactus"
          onClick={onClick}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact Us
        </NavLink>

        <NavLink
          to="/aboutus"
          onClick={onClick}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          About Us
        </NavLink>
      </>
    );
  };

  // ✅ Common account links (use same on desktop + mobile)
  const AccountLinks = ({ onClick, variant = "desktop" }) => {
    // variant: "desktop" => uses your .Link column layout
    // variant: "mobile" => uses your .mobile-menu-item layout
    if (variant === "desktop") {
      return (
        <>
          <NavLink to="/profile" className="Link" onClick={onClick}>
            <span>
              <IoPersonSharp />
            </span>
            <p>Profile</p>
          </NavLink>

          <NavLink to="/love" className="Link" onClick={onClick}>
            <span>
              <MdMessage />
            </span>
            <p>Message</p>
          </NavLink>

          <NavLink to="/wishlist" className="Link" onClick={onClick}>
            <span style={{ position: "relative" }}>
              <MdOutlineFavorite />
              <Badge value={wishlistCount} />
            </span>
            <p>Wishlist</p>
          </NavLink>

          <NavLink to="/cart" className="Link" onClick={onClick}>
            <span style={{ position: "relative" }}>
              <FaShoppingCart />
              <Badge value={cartCount} />
            </span>
            <p>My cart</p>
          </NavLink>
        </>
      );
    }

    // mobile
    return (
      <>
        <NavLink to="/profile" className="mobile-menu-item" onClick={onClick}>
          <IoPersonSharp />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/love" className="mobile-menu-item" onClick={onClick}>
          <MdMessage />
          <span>Messages</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className="mobile-menu-item"
          onClick={onClick}
          style={{ position: "relative" }}
        >
          <MdOutlineFavorite />
          <span>Wishlist</span>
          <span style={{ marginLeft: "auto", position: "relative" }}>
            <Badge value={wishlistCount} />
          </span>
        </NavLink>

        <NavLink
          to="/cart"
          className="mobile-menu-item"
          onClick={onClick}
          style={{ position: "relative" }}
        >
          <FaShoppingCart />
          <span>My Cart</span>
          <span style={{ marginLeft: "auto", position: "relative" }}>
            <Badge value={cartCount} />
          </span>
        </NavLink>
      </>
    );
  };

  return (
    <header>
      {/* ========================= */}
      {/* ✅ DESKTOP HEADER (≥992px) */}
      {/* ========================= */}
      <div
        data-aos="fade-down"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
        data-aos-duration="1200"
        className="desktop-header d-none d-lg-block"
      >
        {/* Top desktop navbar */}
        <Navbar expand="lg">
          <Container>
            {/* LEFT: Logo */}
            <Navbar.Brand as={Link} to="/">
              <div className="style-logo">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="logo">TamStore</div>
            </Navbar.Brand>

            {/* ✅ Desktop Search */}
            <div style={{ position: "relative", flex: 1 }} ref={suggestWrapRef}>
              <Form
                className="needFit d-none d-lg-flex me-auto align-items-center"
                onSubmit={submitSearch}
                autoComplete="off"
              >
                <input
                  placeholder="Search products..."
                  type="search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowSuggest(true);
                  }}
                  onFocus={() => {
                    if (searchText.trim().length >= 2) setShowSuggest(true);
                  }}
                />

                {/* UI only */}
                <Form.Select className="needFit">
                  <option>All category</option>
                </Form.Select>

                <button type="submit">Search</button>
              </Form>

              {/* ✅ Suggestions dropdown */}
              {showSuggest && searchText.trim().length >= 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 10,
                    marginTop: 6,
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  }}
                >
                  {searchLoading && (
                    <div style={{ padding: 12, color: "#777" }}>
                      Searching...
                    </div>
                  )}

                  {!searchLoading && suggestions.length === 0 && (
                    <div style={{ padding: 12, color: "#777" }}>
                      No results. Press Enter to search anyway.
                    </div>
                  )}

                  {!searchLoading &&
                    suggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goToProduct(p.id)}
                        style={{
                          width: "100%",
                          border: 0,
                          background: "#fff",
                          textAlign: "left",
                          padding: 10,
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #eee",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: "#1c1c1c" }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: 12, color: "#777" }}>
                            ${p.price} • {p.category}
                          </div>
                        </div>
                      </button>
                    ))}

                  {!searchLoading && suggestions.length > 0 && (
                    <button
                      type="button"
                      onClick={viewAllResults}
                      style={{
                        width: "100%",
                        border: 0,
                        background: "#f7f7f7",
                        padding: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View all results →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Right Icons */}
            <div className="d-none d-lg-flex gap-3 holder-access">
              <AccountLinks variant="desktop" />
            </div>
          </Container>
        </Navbar>

        {/* Desktop Second Line */}
        <div className="secondLine">
          <Container>
            <div>
              <Nav>
                <Button variant="primary" onClick={handleShow}>
                  <div>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>All category</p>
                </Button>

                <Offcanvas show={show} onHide={handleClose}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Categories</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>Categories list later...</Offcanvas.Body>
                </Offcanvas>

                {/* ✅ same links as mobile */}
                <Nav.Link as={NavLink} to="/" end>
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/allproducts">
                  Our Products
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contactus">
                  Contact Us
                </Nav.Link>
                <Nav.Link as={NavLink} to="/aboutus">
                  About Us
                </Nav.Link>
              </Nav>
            </div>

            <div className="holder-ship-lang">
              <Form.Select>
                <option>English, USD</option>
              </Form.Select>

              <Form.Select>
                <option>Ship to</option>
              </Form.Select>
            </div>
          </Container>
        </div>
      </div>

      {/* ======================= */}
      {/* ✅ MOBILE HEADER (<992px) */}
      {/* ======================= */}
      <div
        data-aos="fade-down"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
        data-aos-duration="1200"
        className="mobile-header d-lg-none"
      >
        <Navbar className="mobile-navbar">
          <Container className="mobile-navbar__row">
            <Navbar.Brand as={Link} to="/" className="mobile-navbar__brand">
              <div className="style-logo">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="logo">TamStore</div>
            </Navbar.Brand>

            <div className="mobile-navbar__icons">
              {/* ✅ Mobile Search -> go to products page (same as desktop search target) */}
              <button
                type="button"
                className="mobile-icon-btn"
                aria-label="Search"
                onClick={() => navigate("/allproducts")}
              >
                <FaSearch />
              </button>

              <NavLink
                to="/cart"
                className="mobile-icon-btn"
                aria-label="Cart"
                style={{ position: "relative" }}
              >
                <FaShoppingCart />
                <Badge value={cartCount} />
              </NavLink>

              {/* <NavLink
                to="/wishlist"
                className="mobile-icon-btn"
                aria-label="Wishlist"
                style={{ position: "relative" }}
              >
                <MdOutlineFavorite />
                <Badge value={wishlistCount} />
              </NavLink> */}

              <button
                className="mobile-menu-btn"
                type="button"
                onClick={openMobileMenu}
                aria-label="Open menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </Container>
        </Navbar>

        {/* ✅ Mobile second row (same nav links as desktop) */}
        <div className="mobile-search">
          <Container>
            <NavLinks />
          </Container>
        </div>

        {/* ✅ Mobile Offcanvas (put ALL desktop details here too) */}
        <Offcanvas
          show={mobileMenuOpen}
          onHide={closeMobileMenu}
          placement="end"
          className="mobile-offcanvas"
        >
          <Offcanvas.Header closeButton className="mobile-offcanvas__header">
            <Offcanvas.Title className="mobile-offcanvas__title">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="mobile-offcanvas__body">
            {/* Account section (same as desktop icons) */}
            <div className="mobile-menu-section">
              <div className="mobile-menu-title">Account</div>

              <div className="mobile-menu-grid">
                <AccountLinks variant="mobile" onClick={closeMobileMenu} />
              </div>
            </div>

            <div className="mobile-divider" />

            {/* Shop links (same as desktop second line nav) */}
            <div className="mobile-menu-section">
              <div className="mobile-menu-title">Shop</div>

              <div className="mobile-menu-links">
                <NavLink
                  to="/"
                  end
                  className="mobile-menu-link"
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/allproducts"
                  className="mobile-menu-link"
                  onClick={closeMobileMenu}
                >
                  Our Products
                </NavLink>

                <NavLink
                  to="/contactus"
                  className="mobile-menu-link"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </NavLink>

                <NavLink
                  to="/aboutus"
                  className="mobile-menu-link"
                  onClick={closeMobileMenu}
                >
                  About Us
                </NavLink>
              </div>
            </div>

            <div className="mobile-divider" />

            {/* ✅ Desktop "ship/lang" selects in mobile too */}
            <div className="mobile-menu-section">
              <div className="mobile-menu-title">Preferences</div>

              <div className="mobile-selects">
                <Form.Select>
                  <option>English, USD</option>
                </Form.Select>

                <Form.Select>
                  <option>Ship to</option>
                </Form.Select>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </header>
  );
}
