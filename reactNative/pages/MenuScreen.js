import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StoreContext } from "../contexts/StoreContext";
const MenuScreen = ({ route }) => {
  const restaurantId = 1; // Static for now, update if needed
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [userId, setUserId] = useState(user_id);
  const [token, setToken] = useState(null);
  // const uri = useContext(StoreContext);
  const uri = 'http://13.61.209.211:3000';

  useEffect(() => {
    

    const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user_id");

    // Optionally navigate to the login screen
    navigation.navigate("LoginScreen");

    // Ensure the app exits
    setTimeout(() => {
      BackHandler.exitApp();
    }, 500); // Small delay ensures navigation is cleared
  } catch (error) {
    console.error("Logout error:", error);
  }
};
    
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user_id = await AsyncStorage.getItem("user_id");
        if (!token || !user_id) {
          alert("Session expired. Logging out.");
          handleLogout();
          return;
        }
    
        const response = await axios.get(`${uri}/cart/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Session expired. Logging out.");
        handleLogout();
      }
    };
    
    fetchCart();

    console.log("Received restaurantId:", restaurantId);
    if (restaurantId) {
      axios
        .get(`${uri}/api/menu/menu-items/restaurant/${restaurantId}`)
        .then((response) => {
          console.log("Menu Response:", JSON.stringify(response.data, null, 2)); // Debugging
          setMenu(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching menu:", error);
          setLoading(false);
        });
    } else {
      console.error("restaurantId is undefined");
      setLoading(false);
    }
  }, [restaurantId]);

  const addToCart = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");
  
      if (!token || !userId) {
        console.error("Token or User ID is missing");
        alert("Please log in again.");
        return;
      }
  
      const response = await axios.post(
        `${uri}/api/cart/add-to-cart`,
        {
          user_id: userId,
          restaurant_id: restaurantId,
          item_id: itemId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert("Item added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#EE3A3A" style={styles.loadingIndicator} />;
  }

  if (menu.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMenuText}>No menu items found for this restaurant.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Menu Items</Text>
      <FlatList
  data={menu}
  keyExtractor={(item) => item.item_id.toString()}
  renderItem={({ item }) => (
    <View style={styles.menuItem}>
      {item.image && (
        <Image
          source={{ uri: `${uri}/public/${item.image}` }}
          style={styles.itemImage}
          onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
        />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => addToCart(item.item_id)} style={styles.addToCartButton}>
        <Text style={{ color: "white", fontWeight: "bold" }}>+</Text> {/* Ensure text is wrapped */}
      </TouchableOpacity>
    </View>
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  noMenuText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
  },
  headerText: {
    marginTop: 25,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
  },
  addToCartButton: {
    backgroundColor: "#EE3A3A",
    padding: 8,
    borderRadius: 4,
  },
});

export default MenuScreen;
