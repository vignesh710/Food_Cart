import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [userdatas, setUserdatas] = useState(null);
  const [token, setToken] = useState(false);
  useEffect(() => {
    try {
      const tokens = JSON.parse(localStorage.getItem("Token"));
      const localStorageAllKeys = Object.keys(localStorage);
      const userDataKeys = localStorageAllKeys.filter((key) =>
        key.startsWith("user_")
      );
      const allUserDatas = userDataKeys.map((key) => {
        return JSON.parse(localStorage.getItem(key));
      });
      setUserdatas(allUserDatas);
      if (tokens) {
        setToken(true);
        console.log(tokens);
      }
    } catch (error) {
      console.error(
        "Error occurred while fetching data from local storage:",
        error
      );
    }
  }, [token]);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    userdatas,
    setUserdatas,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
