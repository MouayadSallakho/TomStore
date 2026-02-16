import React from "react";
import "../../assets/Componants/Header/Header";
import Header from "../../assets/Componants/Header/Header";
import HeroSection from "../../assets/Componants/HeroSection/HeroSection";
import "./Home.css";
import DealsAndOffers from "../../assets/Componants/DealsAndOffers/DealsAndOffers";
import ShowProducts from "../../assets/Componants/ShowProducts/ShowProducts";

import back from "../../assets/Images/backgrounMobile.png";
import backk from "../../assets/Images/background_canab.png";
import OrderqQuantities from "../../assets/Componants/OrderqQuantities/OrderqQuantities";
import RecommendedItems from "../../assets/Componants/RecommendedItems/RecommendedItems";
import Ourextraservices from "../../assets/Componants/Ourextraservices/Ourextraservices";
import AllFlag from "../../assets/Componants/AllFlag/AllFlag";
import PartSubscribe from "../../assets/Componants/PartSubscribe/PartSubscribe";
import Footer from "../../assets/Componants/Footer/Footer";
const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <DealsAndOffers />

      <ShowProducts
        title="Home and outdoor"
        slug="mobile-accessories"
        bg={back}
      />
      <ShowProducts
        title="Mobile Accessories"
        slug="kitchen-accessories"
        bg={backk}
      />

      <OrderqQuantities />

      <RecommendedItems
        title="Recommended items"
        slug="smartphones"
        limit={10}
      />

      <Ourextraservices />

      <AllFlag />

      <PartSubscribe />

      <Footer />
    </div>
  );
};

export default Home;
