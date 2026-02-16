import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../../api/endpoints";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

import Watch from "../../Images/watch.png";
import "./DealsAndOffers.css";
const DealsAndOffers = () => {
  const [category, setCategory] = useState("laptops");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const [categoriess, setCategoriess] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(ENDPOINTS.productsByCategory(category))
      .then((res) => {
        if (!res.ok) {
          throw new Error("Faild To Fetch the Products");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setProducts(data.products || []);

        console.log("FULL RESPONSE:", data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  // useEffect(() => {
  //   fetch("https://dummyjson.com/products/categories")
  //     .then((res) => res.json())
  //     .then((cats) => {
  //       console.log("CATEGORIES:", cats);
  //       setCategoriess(cats);
  //     })
  //     .catch((err) => console.log("Categories error:", err));
  // }, []);



  const dealEnd = new Date();
dealEnd.setHours(dealEnd.getHours() + 12); // ✅ example: deal ends after 12 hours

const calcTimeLeft = (endDate) => {
  const diff = endDate.getTime() - new Date().getTime();

  if (diff <= 0) {
    return { days: "00", hours: "00", mins: "00", secs: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");

  return {
    days: pad(days),
    hours: pad(hours),
    mins: pad(mins),
    secs: pad(secs),
  };
};

const [timeLeft, setTimeLeft] = useState(calcTimeLeft(dealEnd));

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(calcTimeLeft(dealEnd));
  }, 1000);

  return () => clearInterval(interval);
}, []);




  return (
    <div className="DealsAndOffers">
      <Container>
        <Row className="">
          <Col lg={3} className="leftBox col-md-4">
            <div>
              <p>Deals and offers</p>
              <span>Hygiene equipments</span>
<ul>
  <li>
    <p>{timeLeft.days}</p>
    <span>Days</span>
  </li>
  <li>
    <p>{timeLeft.hours}</p>
    <span>Hour</span>
  </li>
  <li>
    <p>{timeLeft.mins}</p>
    <span>Min</span>
  </li>
  <li>
    <p>{timeLeft.secs}</p>
    <span>Sec</span>
  </li>
</ul>
            </div>
          </Col>
          <Col lg={9} className="rightBox col-md-8">
            <Swiper
              spaceBetween={0}
              slidesPerView={1.5}
              breakpoints={{
                0: { slidesPerView: 1.7 },
                568: { slidesPerView: 2.7 },
                768: { slidesPerView: 2.7 }, // md
                992: { slidesPerView: 5 }, // lg
              }}
              pagination={true}
              modules={[Pagination]}
              className="mySwiper"
            >
{loading
  ? Array.from({ length: 10 }).map((_, i) => (
      <SwiperSlide key={`sk-${i}`}>
        <div className="deal-card skeleton-card">
          <div className="deal-shine"></div>
          <div className="deal-overlay"></div>

          <div className="sk-img"></div>
          <div className="sk-title"></div>
          <div className="sk-badge"></div>
        </div>
      </SwiperSlide>
    ))
  : products.map((p) => (
      <SwiperSlide key={p.id}>
        <div className="deal-card">
          <div className="deal-shine"></div>
          <div className="deal-overlay"></div>

          <img src={p.thumbnail} alt={p.title} />
          <p className="deal-title">{p.title}</p>
          <span className="deal-discount">
            -{Math.round(p.discountPercentage)}%
          </span>

          <NavLink to={`/product/${p.id}`} className="deal-view">
            View
          </NavLink>
        </div>
      </SwiperSlide>
    ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DealsAndOffers;
