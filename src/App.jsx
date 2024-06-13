import { useState, useEffect, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import { StoreContext } from "./Context/StoreContext";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    if (storedToken) {
      setIsAuthenticated(true);
    } else {
      setShowLogin(true);
    }
   
  }, []);

  useEffect(() => {
    if (showLogin) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showLogin]);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  return (
    <>
      {showLogin ? (
        <LoginPopUp setShowLogin={setShowLogin} handleLogin={handleLogin} />
      ) : (
        <></>
      )}
      <div className="App">
        <Navbar
          setShowLogin={setShowLogin}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
