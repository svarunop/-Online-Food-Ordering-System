import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StoreContext } from "../contexts/StoreContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Swipeable } from "react-native-gesture-handler";

const uri = "http://13.61.209.211:3000";
const API_URL = `${uri}/api/cart`;
const LOGIN_URL = `${uri}/api/login`;
const IMG_URL = `${uri}`;

const Cart = () => {
  const { removeFromCart } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const navigation = useNavigation();
  const [total, setTotal] = useState(99); 
  

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log("Cart Updated:", cartItems);
          setLoading(true);
          const token = await AsyncStorage.getItem("token");
          const userId = await AsyncStorage.getItem("user_id");
    
          if (!token || !userId) {
              console.log("No token or user ID found.");
              setLoading(false);
              return;
          }
    
          const response = await axios.get(`${uri}/api/cart/cart/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.data && Array.isArray(response.data)) {
              // Only update state if cart data is different
              if (JSON.stringify(cartItems) !== JSON.stringify(response.data)) {
                  setCartItems(response.data);
                  calculateSubTotal(response.data);
              }
          } else {
              console.error("Unexpected response format:", response.data);
          }
      } catch (error) {
          console.error("Error fetching cart:", error?.response?.data || error);
      } finally {
          setLoading(false);
      }
    };


    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("user_id");

        if (token && userId) {
          setIsLoggedIn(true);

          if (!cartItems.length) {
            await fetchCart(); // ✅ Ensure fetchCart is awaited
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false); // ✅ Ensure loading state updates
      }
    };
    calculateSubTotal();
    checkLoginStatus();
}, [cartItems]); 


const calculateSubTotal = () => {
  if (cartItems.length > 0) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubTotal(subtotal);

    const deliveryCharge = 99;
    setTotal(subtotal + deliveryCharge);
  } else {
    setSubTotal(0);
    setTotal(99);
  }
};


  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(LOGIN_URL, { username, password });
      const { token, user_id } = response.data;
  
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user_id", user_id);
  
      setIsLoggedIn(true);
      fetchCart(); 
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeader}>Please Log In</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getUserId = async () => {
    try {
        const userId = await AsyncStorage.getItem("user_id"); 
        if (!userId) {
            console.error("User ID not found in AsyncStorage");
            return null;
        }
        return userId;
    } catch (error) {
        console.error("Error retrieving user ID:", error);
        return null;
    }
};


const handleRemoveItem = async (itemId) => {
  try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId || !token) {
          console.error("User ID or token is missing. Cannot remove item.");
          return;
      }

      await axios.delete(`${uri}/api/cart/cart/${userId}/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure correct ID comparison
      setCartItems((prevItems) => prevItems.filter((item) => item.item_id !== itemId));

      console.log(`Item ${itemId} removed successfully`);
  } catch (error) {
      console.error("Remove item error:", error.response?.data || error.message);
  }
};






  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      await axios.put(
        `${API_URL}/update-quantity`,
        { item_id: itemId, user_id: userId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.item_id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Quantity update error:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  const renderRightActions = (item) => {
    console.log("Swipe Delete for:", item.item_id);
    return (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveItem(item.item_id)}
        >
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    );
};

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.item}>
        <Image
          source={{ uri: `${IMG_URL}/public/${item.image}` }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description || "No Description"}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.item_id, item.quantity - 1)}
            style={styles.qtyButton}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.item_id, item.quantity + 1)}
            style={styles.qtyButton}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  const deliveryFee = subTotal >= 99 ? 0.0 : 99;
  // const total = subTotal + deliveryFee;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cart Items</Text>
      {loading ? (
    <ActivityIndicator size="large" color="tomato" style={{ marginTop: 50 }} />
) : (!loading && cartItems.length === 0) ? (
    <View style={styles.emptyContainer}>
        <Image source={require("../assets/indianAccent.png")} style={styles.emptyImage} />
        <Text style={styles.emptyText}>Your cart is empty.</Text>
        <Text style={styles.emptySubText}>Add items to place an order.</Text>
    </View>
) : (
    <>
        <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.item_id}-${index}`}
        />
        <View style={styles.bottom}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Cart Totals</Text>
                <View style={styles.totalDetails}>
                    <Text>Subtotal</Text>
                    <Text>₹{subTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalDetails}>
                    <Text>Delivery Fee</Text>
                    <Text>₹{deliveryFee.toFixed(2)}</Text>
                </View>
                <View style={styles.totalDetails}>
                    <Text>Total</Text>
                    <Text>₹{total.toFixed(2)}</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate("ConfirmOrder")}
                style={styles.checkoutButton}
            >
                <Text style={styles.checkoutText}>CONFIRM ORDER</Text>
            </TouchableOpacity>
        </View>
    </>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#ffbe30",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  description: { fontSize: 14, color: "#666", marginTop: 4 },
  price: { fontSize: 16, fontWeight: "bold", color: "#000", marginTop: 8 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 8,
  },
  qtyButton: {
    padding: 8,
    backgroundColor: "orange",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  qtyButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  quantity: { fontSize: 18, fontWeight: "bold", color: "#333" },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    borderRadius: 12,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  headerText: {
    marginTop: 25,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bottom: { marginTop: 40 },
  totalContainer: { marginBottom: 20 },
  totalText: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  totalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: "#ffbe30",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImage: { width: 200, height: 200, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 30,
  },
});


export default Cart;