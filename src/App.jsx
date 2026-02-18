import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./Pages/Home/Home";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Allproducts from "./Pages/AllProducts/AllProducts";
import Details from "./Pages/details/Details";
import Cart from "./Pages/crat/Cart";
import Wishlist from "./Pages/wishlist/Wishlist";

import "./App.css";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/allproducts" element={<Allproducts />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/product/:id" element={<Details />} />
      <Route path="/Details" element={<Details />} />
      <Route path="/Cart" element={<Cart />} />
    </Routes>
  );
}
