import React, { useContext, useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const LoginPopUp = ({ setShowLogin, handleLogin }) => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { userdatas, setToken } = useContext(StoreContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const updateData = (userId, newData) => {
    const existingData = JSON.parse(
      localStorage.getItem(`user_${userId}`) || "{}"
    );
    const updatedData = { userId: userId, ...existingData, ...newData };
    localStorage.setItem(`user_${userId}`, JSON.stringify(updatedData));
  };
  const generateUserId = () => {
    const lastUserId = parseInt(localStorage.getItem("LastUserId")) || 0;
    const nextUserId = lastUserId + 1;
    localStorage.setItem("LastUserId", nextUserId);
    return nextUserId;
  };

  const onLogin = (event) => {
    event.preventDefault();
    const errors = validate(data);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      let userId;
      if (currentState === "Sign Up") {
        userId = generateUserId();
        updateData(userId, data);
      }
      if (currentState === "Sign Up" || currentState === "Login") {
        localStorage.setItem("Token", JSON.stringify("1234567890abcdef"));
      }
      setShowLogin(false);
      handleLogin();
      setToken(true);
      navigate("/");
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const name_regex = /^\s*$/;

    if (currentState === "Sign Up") {
      if (!values.name) {
        errors.name = "Name is required!";
      } else if (name_regex.test(values.name)) {
        errors.name = "Name should not be empty";
      }
    }

    if (currentState === "Sign Up") {
      if (!values.email) {
        errors.email = "email is required!";
      } else if (!regex.test(values.email)) {
        errors.email = "This is not valid email";
      }
    }
    if (currentState === "Login") {
      
      if (!values.email) {
        errors.email = "Enter your email";
      } else {
        const user = userdatas.find((user) => user.email === values.email);
        if (!user) {
          errors.email = "User not found";
        } 
      }
    }
    if (currentState === "Sign Up") {
      if (!values.password) {
        errors.password = "password is required!";
      } else if (values.password.length < 4) {
        errors.password = "Password must be more than 4 characters";
      } else if (values.password.length > 9) {
        errors.password = "Password must be less than 9 characters";
      }
    }
    if (currentState === "Login") {
      if (!values.password) {
        errors.password = "Enter password";
      } else{
        const user = userdatas.find((user) => user.email === values.email);
        if (values.password !== user.password ) {
          errors.password = "Enter correct password";
        }
      }
    }
    return errors;
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                placeholder="Your name"
              />
              {formErrors.name && (
                <p className="showerrors">{formErrors.name}</p>
              )}
            </>
          )}
          <input
            type="text"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Your email"
          />
          <p className="showerrors">{formErrors.email}</p>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Your password"
          />
          <p className="showerrors">{formErrors.password}</p>
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login Here</span>{" "}
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
