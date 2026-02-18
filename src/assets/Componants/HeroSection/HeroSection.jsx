import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import UserAvatar from "../../Images/User-Avatar.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HeroSection.css";

import { Autoplay } from "swiper/modules";

const HeroSection = () => {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  useEffect(() => {
    setCatLoading(true);
    setCatError("");

    fetch("https://dummyjson.com/products/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        // data can be array of strings OR array of objects (depends on API version)
        const normalized = (Array.isArray(data) ? data : [])
          .map((c) => {
            if (typeof c === "string") return { slug: c, name: c };
            return { slug: c.slug, name: c.name };
          })
          .filter((c) => c.slug && c.name);

        setCategories(normalized);
      })
      .catch((err) => setCatError(err.message || "Error loading categories"))
      .finally(() => setCatLoading(false));
  }, []);

  // ✅ show only first 8 like your UI, last item becomes "More category"
  const shownCats = categories.slice(0, 8);

  return (
    <div>
      <section className="HerSection">
        <Container>
          <Row>
            <Col
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200"
              lg={3}
              className="col-3"
            >
              <ul>
                {catLoading && (
                  <li>
                    <span>Loading...</span>
                  </li>
                )}

                {!catLoading && catError && (
                  <li>
                    <span style={{ color: "red" }}>{catError}</span>
                  </li>
                )}

                {!catLoading &&
                  !catError &&
                  shownCats.map((cat, index) => (
                    <li
                      key={cat.slug}
                      className={index === 0 ? "activeee" : ""}
                    >
                      {/* ✅ this link can go to allproducts with category filter */}
                      <NavLink to={`/allproducts?category=${cat.slug}`}>
                        {cat.name}
                      </NavLink>
                    </li>
                  ))}

                {!catLoading && !catError && categories.length > 8 && (
                  <li>
                    <NavLink to="/allproducts">More category</NavLink>
                  </li>
                )}
              </ul>
            </Col>

            <Col
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200"
              lg={6}
              className="col-12"
            >
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>Electronic items</h2>
                  <NavLink className="link" to="/allproducts">
                    Learn more
                  </NavLink>
                </SwiperSlide>

                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>New arrivals</h2>
                  <NavLink className="link" to="/allproducts">
                    Learn more
                  </NavLink>
                </SwiperSlide>

                <SwiperSlide>
                  <p>Latest trending</p>
                  <h2>Best sellers</h2>
                  <NavLink className="link" to="/allproducts">
                    Learn more
                  </NavLink>
                </SwiperSlide>
              </Swiper>
            </Col>

            <Col
              data-aos="fade-left"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200"
              lg={3}
              className="col-3"
            >
              <div className="login">
                <div>
                  <img src={UserAvatar} alt="UserAvatar" />
                  <div>
                    <p>Hi, user</p>
                    <span>let’s get stated</span>
                  </div>
                </div>
                <NavLink className="btn w-100 mb-2" to="/register">
                  Join now
                </NavLink>
                <NavLink className="btn w-100" to="/login">
                  Log in
                </NavLink>
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
