import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ENDPOINTS } from "../../../api/endpoints";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import "./DealsAndOffers.css";

const DealsAndOffers = () => {
  const [category, setCategory] = useState("laptops");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ deal ends after 12 hours (example)
  const dealEnd = new Date();
  dealEnd.setHours(dealEnd.getHours() + 12);

  const calcTimeLeft = (endDate) => {
    const diff = endDate.getTime() - new Date().getTime();
    if (diff <= 0) return { days: "00", hours: "00", mins: "00", secs: "00" };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(ENDPOINTS.productsByCategory(category))
      .then((res) => {
        if (!res.ok) throw new Error("Faild To Fetch the Products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="DealsAndOffers">
      <Container>
        <Row>
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
    768: { slidesPerView: 2.7 },
    992: { slidesPerView: 5 },
  }}
  className="mySwiper"
>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <SwiperSlide key={`sk-${i}`}>
                      <div className="deal-card skeleton-card">
                        <div className="sk-img"></div>
                        <div className="sk-title"></div>
                        <div className="sk-badge"></div>
                      </div>
                    </SwiperSlide>
                  ))
                : products.map((p) => (
                    <SwiperSlide key={p.id}>
                      <div 
        className="deal-card">
                        {/* ✅ only image + title clickable */}
                        <NavLink
                          to={`/product/${p.id}`}
                          className="deal-link"
                          aria-label={`Open ${p.title}`}
                        >
                          <img src={p.thumbnail} alt={p.title} />
                          <p className="deal-title">{p.title}</p>
                        </NavLink>

                        <span className="deal-discount">
                          -{Math.round(p.discountPercentage)}%
                        </span>
                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>

            {error && <p className="deal-error">{error}</p>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DealsAndOffers;
