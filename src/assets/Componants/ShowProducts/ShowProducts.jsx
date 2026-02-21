import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../../api/endpoints";

import "swiper/css";
import "swiper/css/grid";

import { Grid, Pagination } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules

import "./ShowProducts.css";
const ShowProducts = ({ title, slug, bg}) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(ENDPOINTS.productsByCategory(slug))
      .then((res) => {
        if (!res.ok) {
          throw new Error("Faild To Fetch the Products");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setProducts(data.products || []);

        // console.log("FULL RESPONSE:", data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="ShowProducts">
      <Container>
        <Row className="g-0">
          <Col lg={3} className="leftBanner col-md-4"
            style={{ backgroundImage: `url(${bg})` }}>
            <div>
              <p>Home and outdoor</p>
             <NavLink to={`/category/${slug}`} className="link">
  Source now
</NavLink>
            </div>
          </Col>

          <Col lg={9} className="rightProducts  col-md-8">
            <Swiper
              modules={[Grid, Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={0}
              grid={{ rows: 2, fill: "row" }} // ✅ 2 rows
              slidesPerView={4} // ✅ 4 columns
              breakpoints={{
                0: { slidesPerView: 1.7, grid: { rows: 2 } }, // small
                568: { slidesPerView: 2.4, grid: { rows: 2 } }, // md
                768: { slidesPerView: 2.7, grid: { rows: 2 } }, // md
                992: { slidesPerView: 4, grid: { rows: 2 } }, // lg => 8 items visible
              }}
            >
{loading
  ? Array.from({ length: 8 }).map((_, i) => (
      <SwiperSlide key={`sk-${i}`} className="prodCell">
        <div className="prodInner prodSkeleton">
          <div>
            <div className="sk-prod-title"></div>
            <div className="sk-prod-price"></div>
          </div>
          <div className="sk-prod-img"></div>
        </div>
      </SwiperSlide>
    ))
: products.slice(0, 8).map((p) => (
  <SwiperSlide key={p.id} className="prodCell">
    <NavLink data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine"
       data-aos-duration="800" to={`/product/${p.id}`} className="prodLink">
      <div className="prodInner">
        <div>
          <p className="prodTitle">{p.title}</p>
          <span className="prodPrice">From USD {p.price}</span>
        </div>
        <img src={p.thumbnail} alt={p.title} className="prodImg" />
      </div>
    </NavLink>
  </SwiperSlide>
))}

            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShowProducts;
