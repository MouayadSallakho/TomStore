import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, NavLink } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

import { useState } from "react";
import Button from "react-bootstrap/Button";

import "../Header/Header.css";

export default function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <header>
      <div>
        <Navbar expand="lg" className=" ">
          <Container>
            {/* LEFT: Logo */}
            <Navbar.Brand as={Link} to="/" className="">
              <div className="style-logo">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="logo">TamStore</div>
            </Navbar.Brand>

            {/* ✅ Desktop links next to logo (hidden on mobile) */}
            <Form className="d-none d-lg-flex me-auto align-items-center">
              <input placeholder="Search" type="search" />
              <Form.Select>
                <option>All category</option>
                <option>Default selectt</option>
                <option>Default selecttt</option>
              </Form.Select>
              <button>Search</button>
            </Form>
            {/* <Nav className="d-none d-lg-flex me-auto align-items-center gap-3">
          <Nav.Link as={NavLink} to="/" end>
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/shop">
            Shop
          </Nav.Link>
          <Nav.Link as={NavLink} to="/about">
            About
          </Nav.Link>
        </Nav> */}

            {/* ✅ Desktop right side (hidden on mobile) */}
            <div className="d-none d-lg-flex  gap-3 holder-access">
                    <NavLink to="/profile" className="Link">
                        <span>
                        <IoPersonSharp />
                        </span>
                        <p>Profile</p>
                    </NavLink>
              <NavLink to="/love" className="Link">
                <span>
                  <MdMessage />
                </span>
                <p>Message</p>
              </NavLink>
              <NavLink to="/love" className="Link">
                <span>
                  <MdOutlineFavorite />
                </span>
                <p>Orders</p>
              </NavLink>
              <NavLink to="/love" className="Link">
                <span>
                  <FaShoppingCart />
                </span>
                <p>My cart</p>
              </NavLink>


       


            </div>

            {/* ✅ Mobile toggle only (shows under 992px) */}
            <Navbar.Toggle
              className="d-lg-none"
              aria-controls="offcanvasNavbar"
            />

            {/* ✅ Mobile Offcanvas menu (your mobile layout separately) */}
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
              className="d-lg-none"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel">
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                {/* Mobile Links (separate from desktop) */}
                <Nav className="flex-column gap-2">
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/shop">
                    Shop
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/about">
                    About
                  </Nav.Link>

                  <hr />

                  {/* Mobile actions (separate behavior/design) */}
                  <Nav.Link as={NavLink} to="/profile">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/love">
                    Love
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </div>
      <div className="secondLine">
        <Container>
                <div>
                              <Nav className="">
            <Button variant="primary " onClick={handleShow}>
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>All category</p>
              
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements
                you have chosen. Like, text, images, lists, etc.
              </Offcanvas.Body>
            </Offcanvas>

<Nav.Link as={NavLink} to="/">
  Home
</Nav.Link>

<Nav.Link as={NavLink} to="/allProducts">
  Our Products
</Nav.Link>
<Nav.Link as={NavLink} to="/ContactUs" end>
  ContactUs
</Nav.Link>

<Nav.Link as={NavLink} to="/AboutUs">
  AboutUs
</Nav.Link>
<Nav.Link as={NavLink} to="/Cart">
  Cart
</Nav.Link>
<Nav.Link as={NavLink} to="/wishlist">
  Wishlist
</Nav.Link>

      






{/* <Nav.Link as={NavLink} to="/Details">
  Product Details
</Nav.Link> */}

      {/* <Form.Select>
        <option>Help</option>
             <option>Helpp</option>
                  <option>Helppp</option>
                       <option>Helppppp</option>
      </Form.Select> */}


          </Nav>
                </div>
                <div className="holder-ship-lang">
                      <Form.Select>
        <option>English, USD</option>
             <option>Helpp</option>
                  <option>Helppp</option>
                       <option>Helppppp</option>
      </Form.Select>
            <Form.Select>
        <option>Ship to</option>
             <option>Helpp</option>
                  <option>Helppp</option>
                       <option>Helppppp</option>
      </Form.Select>
                </div>


        </Container>
      </div>
    </header>
  );
}
