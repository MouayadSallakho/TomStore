import React from "react";
import { Container, Breadcrumb, Row, Col } from "react-bootstrap";
import "./ContactUs.css";

import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaXbox } from "react-icons/fa";

import Footer from "../../assets/Componants/Footer/Footer";
import Header from "../../assets/Componants/Header/Header";
import AllFlag from "../../assets/Componants/AllFlag/AllFlag";
import PartSubscribe from "../../assets/Componants/PartSubscribe/PartSubscribe";

const ContactUs = () => {
  return (
    <div>
      <Header />

      <div className="SorcThePage">
        <Container>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Contact Us</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* HERO + 4 CARDS */}
      <section className="ContactHero">
        <Container>
          <h1 className="contactTitle">Contact Us</h1>

          <Row className="contactCardsRow">
            <Col lg={3} md={6}>
              <div className="cardContact">
                <i><FaMapMarkerAlt /></i>
                <p>OUR MAIN OFFICE</p>
                <span>SOHo 95 Bradway st New York , NY 1001</span>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="cardContact">
                <i><FaPhoneAlt /></i>
                <p>PHONE</p>
                <span>+1 (234) 567-8901</span>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="cardContact">
                <i><MdEmail /></i>
                <p>EMAIL</p>
                <span>support@tamstore.com</span>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="cardContact">
                <i><FaXbox /></i>
                <p>SUPPORT</p>
                <span>24/7 Live Support</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FORM + GET IN TOUCH */}
      <section className="underOurCards">
        <Container>
          <Row className="contactMainRow g-4">
            {/* form left */}
            <Col lg={6} className="left">
              <form className="contactForm" onSubmit={(e) => e.preventDefault()}>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="Enter a valid email address" />
                </div>

                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" placeholder="Enter your name" />
                </div>

                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Enter your message" />
                </div>

                <button type="submit" className="btnSubmit">
                  SUBMIT
                </button>
              </form>
            </Col>

            {/* text right */}
            <Col lg={6} className="right">
              <h3 className="touchTitle">Get in touch</h3>
              <p className="touchText">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                doloribus et doloremque. Vero illo nam vel obcaecati eaque quas
                modi, incidunt iusto nihi!
              </p>

              <span className="touchSpan">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Aliquam facere laborum nesciunt quos voluptatum quae unde illum,
                nostrum delectus alias ipsum? Quam culpa numquam consequatur
                neque eaque incidunt unde rem?
              </span>

              <ul className="socialList">
                <li>
                  <a href="#" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram">
                    <FaInstagramSquare />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="WhatsApp">
                    <IoLogoWhatsapp />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <AllFlag />
      <PartSubscribe />
      <Footer />
    </div>
  );
};

export default ContactUs;
