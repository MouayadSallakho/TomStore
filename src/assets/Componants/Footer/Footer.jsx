import React from "react";
import { Col, Row , Container } from "react-bootstrap";
import appStore from "../../Images/Aplle.png"
import googleStore from "../../Images/AppStore.png"
import {  Nav, Navbar, Offcanvas, Button } from "react-bootstrap";



import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import "./Footer.css"
const Footer = () => {
  return (
          <footer >
        <Container>
          <Row className="g-md-5 g-sm-5 g-4">
            <Col lg={3}>
            <Navbar.Brand  to="/" className="">
              <div className="style-logo">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="logo">TamStore</div>
            </Navbar.Brand>
              <p>
                Best information about the company gies here but now lorem ipsum
                is
              </p>
              <div className="social">
                <div><FaSquareInstagram /></div>
                <div><FaFacebookF /></div>
                <div><FaTwitter /></div>
                <div><FaLinkedinIn /></div>
                <div><FaYoutube /></div>
              </div>
            </Col>
            <Col lg={9}>
              <Row className="row-cols-2 row-cols-lg-5  row-cols-sm-3 g-4">
                              <Col >
              <p>About</p>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Find store</a>
                </li>
                <li>
                  <a href="#">Categories</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
              </ul>
            </Col>

                        <Col >
              <p>Partnership</p>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Find store</a>
                </li>
                <li>
                  <a href="#">Categories</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
              </ul>
            </Col>

                        <Col >
              <p>Information</p>
              <ul>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Money Refund</a>
                </li>
                <li>
                  <a href="#">Shipping</a>
                </li>
                <li>
                  <a href="#">Contact us</a>
                </li>
              </ul>
            </Col>

                        <Col>
              <p>For users</p>
              <ul>
                <li>
                  <a href="#">Login</a>
                </li>
                <li>
                  <a href="#">Register</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#">My Orders</a>
                </li>
              </ul>
            </Col>

                        <Col >

              <p>Get app</p>
              <ul>
                <li>
                  <a href="#">
                    <img src={appStore} alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={googleStore} alt="" />
                  </a>
                </li>
              </ul>
            </Col>



              </Row>
            </Col>





          </Row>
        </Container>
      </footer>
  )
}

export default Footer