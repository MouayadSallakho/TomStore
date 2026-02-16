import React from "react";
import { Container, Col, Row } from "react-bootstrap";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "./AllFlag.css"
import Flaq1 from "../../Images/Flaq1.png";
import Flaq2 from "../../Images/Flaq2.png";
import Flaq3 from "../../Images/Flaq3.png"; 
import Flaq4 from "../../Images/Flaq4.png";
import Flaq5 from "../../Images/Flaq5.png";
import Flaq6 from "../../Images/Flaq6.png";

const AllFlag = () => {


    const cols = [
  [
    { img: Flaq1, name: "Arabic Emirates", url: "shopname.ae" },
    { img: Flaq2, name: "Denmark", url: "denmark.com.dk" },
  ],
  [
    { img: Flaq3, name: "Australia", url: "shopname.au" },
    { img: Flaq4, name: "France", url: "shopname.fr" },
  ],
  [
    { img: Flaq5, name: "United States", url: "shopname.us" },
    { img: Flaq6, name: "China", url: "shopname.cn" },
  ],
];

const allCols = [...cols, ...cols, ...cols];

  return (
    <div className="region">
      <Container>
        <h2>Suppliers by region</h2>
   </Container>

        {/* ✅ Mobile swiper */}
<Swiper
  modules={[Autoplay, FreeMode]}
  loop={true}
  freeMode={true}
  freeModeMomentum={false}
  allowTouchMove={true}
  speed={7000}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  }}
  spaceBetween={12}
  breakpoints={{
    0: { slidesPerView: 1.4 },
    576: { slidesPerView: 2.4 },
    768: { slidesPerView: 3.4 },
    992: { slidesPerView: 6 }, // ✅ lg like row-cols-lg-5
  }}
  className="flagsSwiper"
>
  {allCols.map((col, idx) => (
    <SwiperSlide key={idx}>
      <div className="flagCol">
        {col.map((item, i) => (
          <div key={i} className="flagItem">
            <img src={item.img} alt={item.name} />
            <div className="info">
              <p>{item.name}</p>
              <span>{item.url}</span>
            </div>
          </div>
        ))}
      </div>
    </SwiperSlide>
  ))}
</Swiper>

   
    </div>
  );
};

export default AllFlag;
