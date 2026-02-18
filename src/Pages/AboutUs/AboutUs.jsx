import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { NavLink } from "react-router-dom";

import Header from "../../assets/Componants/Header/Header";
import Footer from "../../assets/Componants/Footer/Footer";
import AllFlag from "../../assets/Componants/AllFlag/AllFlag";
import PartSubscribe from "../../assets/Componants/PartSubscribe/PartSubscribe";

import { IoMdHappy } from "react-icons/io";
import { FaDropbox } from "react-icons/fa";
import { AiOutlineFileProtect, AiOutlineLike } from "react-icons/ai";
import { FaClover } from "react-icons/fa6";
import { TbLamp2 } from "react-icons/tb";

import person1 from "../../assets/Images/person1.avif";
import person2 from "../../assets/Images/person2.jpg";
import person3 from "../../assets/Images/person3.avif";
import person4 from "../../assets/Images/person4.jpg";

import heroBg from "../../assets/Images/banner-office-bkgd.jpg";
import journeyBg from "../../assets/Images/our-journy.png";
import ctaBg from "../../assets/Images/intersted.png";

import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="AboutPage">
      <Header />

      {/* Breadcrumb */}
      <div className="AboutBreadcrumb">
        <Container>
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item as={NavLink} to="/">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>About Us</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* HERO */}
      <section className="AboutHero">
        <Container>
          <div
            className="aboutHeroCard"
            style={{ backgroundImage: `url(${heroBg})` }}
          >
            <div className="aboutHeroInner">
              <h1>About Us</h1>
              <p>
                TamStore is built to make shopping simple, reliable, and fast.
                We focus on quality products, transparent pricing, and a smooth
                customer experience across all devices.
              </p>

              <div className="heroActions">
                {/* ✅ fixed to match App route: /allproducts */}
                <NavLink to="/allproducts" className="btn-primary-tam">
                  Explore products
                </NavLink>

                {/* ✅ matches App route: /ContactUs */}
                <NavLink to="/ContactUs" className="btn-outline-tam">
                  Contact us
                </NavLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* COUNTS */}
      <section className="AboutCounts">
        <Container>
          <Row className="g-3">
            <Col lg={4}>
              <div className="countCard card-hover">
                <div className="iconWrap">
                  <IoMdHappy />
                </div>
                <div>
                  <h3>40,000+</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="countCard card-hover">
                <div className="iconWrap">
                  <FaDropbox />
                </div>
                <div>
                  <h3>99.98%</h3>
                  <p>Order Success Rate</p>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="countCard card-hover">
                <div className="iconWrap">
                  <AiOutlineFileProtect />
                </div>
                <div>
                  <h3>30</h3>
                  <p>Years of Experience</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* JOURNEY + VALUES */}
      <section className="AboutJourneyValues">
        <Container>
          <Row className="g-3">
            <Col lg={6}>
              <div
                className="journeyCard card-hover"
                style={{ backgroundImage: `url(${journeyBg})` }}
              >
                <div className="journeyInner">
                  <h2>Our Journey</h2>

                  <div className="timeline">
                    <div className="timeRow">
                      <div className="year">
                        <h4>2000</h4>
                        <span className="line" />
                      </div>
                      <div className="timeText">
                        <h5>Founded</h5>
                        <p>
                          We launched our first collection and started small.
                        </p>
                      </div>
                    </div>

                    <div className="timeRow">
                      <div className="year">
                        <h4>2005</h4>
                        <span className="line" />
                      </div>
                      <div className="timeText">
                        <h5>Growth</h5>
                        <p>
                          We expanded categories and improved delivery
                          operations.
                        </p>
                      </div>
                    </div>

                    <div className="timeRow">
                      <div className="year">
                        <h4>2024</h4>
                        <span className="line last" />
                      </div>
                      <div className="timeText">
                        <h5>Today</h5>
                        <p>
                          A modern store experience — fast, clean, and
                          responsive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="valuesCard card-hover">
                <h2>Our Values</h2>

                <div className="valuesGrid">
                  <div className="valueItem">
                    <div className="valueIcon">
                      <FaClover />
                    </div>
                    <div>
                      <h5>Customer First</h5>
                      <p>We prioritize trust, service, and long-term value.</p>
                    </div>
                  </div>

                  <div className="valueItem">
                    <div className="valueIcon">
                      <AiOutlineLike />
                    </div>
                    <div>
                      <h5>Quality Service</h5>
                      <p>
                        Reliable experience across checkout, delivery, and
                        support.
                      </p>
                    </div>
                  </div>

                  <div className="valueItem">
                    <div className="valueIcon">
                      <TbLamp2 />
                    </div>
                    <div>
                      <h5>Innovation</h5>
                      <p>
                        We keep improving UI/UX and performance with every
                        release.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TEAM */}
      <section className="AboutTeam">
        <Container>
          <div className="sectionHead">
            <h2>Our Team</h2>
            <p>People behind the store experience.</p>
          </div>

          <Row className="g-3">
            {[person1, person2, person3, person4].map((img, idx) => (
              <Col lg={3} md={6} sm={6} key={idx}>
                <div className="teamCard card-hover">
                  <div className="teamImg">
                    <img src={img} alt="team" />
                  </div>
                  <div className="teamText">
                    <h5>Shourouk Al Badawi</h5>
                    <p>CEO</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="AboutCTA">
        <Container>
          <div className="ctaBox" style={{ backgroundImage: `url(${ctaBg})` }}>
            <div className="ctaInner">
              <div>
                <h3>Interested in our products?</h3>
                <p>Check out our store and see our latest deals.</p>
              </div>

              <div className="ctaActions">
                {/* ✅ fixed to match App route: /allproducts */}
                <NavLink to="/allproducts" className="btn-primary-tam">
                  View products
                </NavLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <AllFlag />
      <PartSubscribe />
      <Footer />
    </div>
  );
};

export default AboutUs;
