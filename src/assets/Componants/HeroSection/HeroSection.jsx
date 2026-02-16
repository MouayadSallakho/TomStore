import { Col, Row, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import UserAvatar from "../../Images/User-Avatar.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HeroSection.css";

import { Pagination, Navigation, Autoplay } from "swiper/modules";

const HeroSection = () => {
  return (
    <div>
      <section className="HerSection">
        <Container>
          <Row>
            <Col lg={3}>
              <ul>
                <li className="activeee">
                  <NavLink to="/">Automobiles</NavLink>
                </li>
                <li>
                  <NavLink to="/">Clothes and wear</NavLink>
                </li>
                <li>
                  <NavLink to="/">Home interiors</NavLink>
                </li>
                <li>
                  <NavLink to="/">Computer and tech</NavLink>
                </li>
                <li>
                  <NavLink to="/">Tools, equipments</NavLink>
                </li>
                <li>
                  <NavLink to="/">Sports and outdoor</NavLink>
                </li>
                <li>
                  <NavLink to="/">Animal and pets</NavLink>
                </li>
                <li>
                  <NavLink to="/">Machinery tools</NavLink>
                </li>
                <li>
                  <NavLink to="/">More category</NavLink>
                </li>
              </ul>
            </Col>

            <Col lg={6}>
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                // navigation={true}
                modules={[Autoplay]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>Electronic items</h2>
                  <NavLink>Learn more</NavLink>
                </SwiperSlide>
                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>Electronic items</h2>
                  <NavLink>Learn more</NavLink>
                </SwiperSlide>
                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>Electronic items</h2>
                  <NavLink>Learn more</NavLink>
                </SwiperSlide>
              </Swiper>
            </Col>
            <Col lg={3}>
              <div className="login">
                <div>
                  <img src={UserAvatar} alt="UserAvatar" />
                  <div>
                    <p>Hi, user</p>
                    <span>let’s get stated</span>
                  </div>
                </div>
                <NavLink className="btn w-100 mb-2">Join now</NavLink>
                <NavLink className="btn w-100">Log in</NavLink>
              </div>
              <div className="getOffer">
                <p>Get US $10 off with a new supplier</p>
              </div>
              <div className="sendQuotes">
                <p>Send quotes with supplier preferences</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HeroSection;
