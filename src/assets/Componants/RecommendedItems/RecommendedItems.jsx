import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ENDPOINTS } from "../../../api/endpoints";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import "./RecommendedItems.css";

const RecommendedItems = ({
  slug = "laptops",
  limit = 10,
  title = "Recommended items",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(ENDPOINTS.productsByCategory(slug))
      .then((res) => {
        if (!res.ok) throw new Error("Failed To Fetch the Products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="Recommended">
      <Container>
        <h3 className="mb-3">{title}</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* ✅ Desktop grid only */}
        <div className="d-none d-lg-block">
          <Row className="g-3 row-cols-5">
            {loading
              ? Array.from({ length: limit }).map((_, i) => (
                  <Col key={`sk-d-${i}`}>
                    <div 
                    
        className="rec-card rec-skeleton">
                      <div className="sk-rec-img"></div>
                      <div className="sk-rec-price"></div>
                      <div className="sk-rec-title"></div>
                    </div>
                  </Col>
                ))
              : products.slice(0, limit).map((p) => (
                  <Col key={p.id}>
                    <NavLink data-aos="fade-up"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine"
       data-aos-duration="1200"

                      to={`/product/${p.id}`}
                      className="rec-link"
                      aria-label={`Open ${p.title}`}
                    >
                      <div className="rec-card">
                        <img src={p.thumbnail} alt={p.title} />
                        <p className="price">${p.price}</p>
                        <p className="title">{p.title}</p>
                      </div>
                    </NavLink>
                  </Col>
                ))}
          </Row>
        </div>

        {/* ✅ Mobile swiper only */}
        <div className="d-block d-lg-none">
          <Swiper
            spaceBetween={12}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            preventClicks={false}
            preventClicksPropagation={false}
            breakpoints={{
              0: { slidesPerView: 1.7 },
              576: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
            }}
          >
            {loading
              ? Array.from({ length: limit }).map((_, i) => (
                  <SwiperSlide key={`sk-m-${i}`}>
                    <div className="rec-card rec-skeleton">
                      <div className="sk-rec-img"></div>
                      <div className="sk-rec-price"></div>
                      <div className="sk-rec-title"></div>
                    </div>
                  </SwiperSlide>
                ))
              : products.slice(0, limit).map((p) => (
                  <SwiperSlide key={p.id}>
                    <NavLink
                    data-aos="fade-up"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine"
       data-aos-duration="1200"
       
                      to={`/product/${p.id}`}
                      className="rec-link"
                      aria-label={`Open ${p.title}`}
                    >
                      <div className="rec-card">
                        <img src={p.thumbnail} alt={p.title} />
                        <p className="price">${p.price}</p>
                        <p className="title">{p.title}</p>
                      </div>
                    </NavLink>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default RecommendedItems;
