import { BrowserRouter, Route, Routes } from "react-router-dom";
import Headers from "./layout/Headers";
import Home from "./layout/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ListProduct from "./components/products/ListProduct";
import ShoppingCart from "./components/products/ShoppingCard";

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ListProduct />} />
        <Route path="/cart" element={<ShoppingCart/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
