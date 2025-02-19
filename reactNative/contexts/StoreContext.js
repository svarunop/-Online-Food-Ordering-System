import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [menuList, setMenuList] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const url = 'http://13.61.209.211:3000';
  const [token, setToken] = useState('');
  const [foodList, setFoodList] = useState([]);


  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        ToastAndroid.show('Item added to cart', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
    }

    if (token) {
      try {
        const response = await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          ToastAndroid.show('Item removed from cart', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const itemInfo = foodList.find((product) => product._id === itemId);
        if (itemInfo) {
          total += itemInfo.price * quantity;
        }
      }
    });
    return total;
  };

  // Update totalAmount whenever cartItems change
  useEffect(() => {
    setTotalAmount(getTotalCartAmount());
  }, [cartItems, foodList]);

  
  

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/user/menu_items`);
    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      ToastAndroid.show('Error fetching food list', ToastAndroid.SHORT);
    }
  };

  const loadCartData = async (userToken) => {
    const response = await axios.post(
      `${url}/api/cart/cart/1`,
      {},
      { headers: { token: userToken } }
    );
    setCartItems(response.data.cartData);
  };

  const addFavorite = (item) => {
    setFavorites((prev) => [...prev, item]);
  };

  const removeFavorite = (itemId) => {
    setFavorites((prev) => prev.filter((item) => item.item_id !== itemId));
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.item_id === itemId);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
  }, []);

  const login = async (newToken) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken('');
  };

  const contextValue = {
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    setTotalAmount,
    setToken,
    login,
    logout,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;