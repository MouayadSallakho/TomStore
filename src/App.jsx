import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Allproducts from "./Pages/AllProducts/AllProducts";
import Details from "./Pages/details/Details";
import Cart from "./Pages/crat/Cart";
import "./App.css";
import Wishlist from "./Pages/wishlist/Wishlist"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/allproducts" element={<Allproducts />} />
<Route path="/wishlist" element={<Wishlist />} />
        {/* ✅ IMPORTANT: this is the route your "View" uses */}
        <Route path="/product/:id" element={<Details />} />

        {/* optional: if you still want /Details to work */}
        <Route path="/Details" element={<Details />} />
               <Route path="/Cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}
