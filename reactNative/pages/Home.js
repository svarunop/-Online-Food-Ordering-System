import React, { useState, useEffect, useContext} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../contexts/StoreContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Platform, ToastAndroid } from "react-native";
const uri = 'http://13.61.209.211:3000';

const API_URL = `${uri}/api/user/menu_items`; // Base URL for images
const restaurantId = 1; 
const FoodCard = ({ item, addFavorite, removeFavorite, isFavorite }) => {
  const imageUrl = `${uri}/public/${item.image}`;

  const addToCart = async (item) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("user_id");

        if (!token || !userId) {
            console.error("Token or User ID is missing");
            Alert.alert("Error", "Please log in again.");
            return;
        }

        const response = await axios.post(
            `${uri}/api/cart/add-to-cart`,
            {
                user_id: Number(userId),
                restaurant_id: item.restaurant_id,
                item_id: item.item_id,
                quantity: 1,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("API Response:", response.data);

        if (response.data.cart_id) {
           
            if (Platform.OS === "android") {
                ToastAndroid.show("Item added successfully!", ToastAndroid.SHORT);
            } else {
                Alert.alert("Success", "Item added successfully!");
            }

          
            fetchCartItems();
        } else {
            Alert.alert("Error", response.data.message || "Failed to add item.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error?.response?.data || error);
        Alert.alert("Error", "Failed to add item to cart.");
    }
};

const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userId = await AsyncStorage.getItem("user_id");

            if (!token || !userId) return;

            const response = await axios.get(`${uri}/api/cart/cart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Updated Cart Items:", response.data);
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error?.response?.data || error);
        }
    };
  
  return (
    <TouchableOpacity style={styles.foodCard}>
      {item.image && <Image source={{ uri: imageUrl }} style={styles.foodImage} />}
      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle}>{item.name}</Text>
        <Text style={styles.foodSubtitle}>₹{item.price}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="#FFB800" />
          <Text style={styles.rating}>4.9</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => isFavorite(item.item_id) ? removeFavorite(item.item_id) : addFavorite(item)}>
            <Ionicons name={isFavorite(item.item_id) ? "heart" : "heart-outline"} size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartButton}>
    <Feather name="plus" size={24} color="#000" />
</TouchableOpacity>

        </View>
      </View>
    </TouchableOpacity>
  );
};



export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState("Fetching location...");
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { addFavorite, removeFavorite, isFavorite } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
    fetchLocation();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMenuItems(data);
      extractCategories(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const extractCategories = (items) => {
    const uniqueCategories = [
      "All",
      ...new Set(items.map((item) => item.category)),
    ];
    setCategories(uniqueCategories);
  };

  const filterMenuItems = () => {
    return menuItems.filter(item => 
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationText("Permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region } = reverseGeocode[0];
        setLocationText(`${city}, ${region}`);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationText("Unable to get location");
    }
  };

const applyFilters = () => {
  let items = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCategory !== "All") {
    items = items.filter((item) => item.category === selectedCategory);
  }

  setFilteredItems(items);
};

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Indian Accent</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{locationText}</Text>
            <Ionicons name="location" size={16} color="#666" />
          </View>
        </View>
        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Profile')}>

        <Ionicons name="person-outline" size={24} color="#000" />
      </TouchableOpacity>
      </View>

           {/* Search Bar */}
           <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>


      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 50 }} 
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center", 
        }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.category,
              selectedCategory === category && styles.categoryActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={1} 
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filterMenuItems()}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
            isFavorite={isFavorite}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.foodGrid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  favicon:{
    marginTop:-20,
    marginLeft:80
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cartButton: {
    marginLeft: 10,
    backgroundColor: "#ffbe30",
    padding: 5,
    borderRadius: 5,
  }, 
  headerTitle: { fontSize: 24, fontWeight: "bold",color:'#ffbe30' },
  profileButton: { padding: 8 },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: { color: "#666", marginRight: 4 },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 8 },
  filterButton: {
    backgroundColor: "#EE3A3A",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

navItem: {
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#EE3A3A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navDot: {
    width: 5,
    height: 5,
    backgroundColor: "#EE3A3A",
    borderRadius: 50,
    marginTop: 3,
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 50,
    overflow: "true",
  },
  category: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginLeft:10,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  categoryActive: {
    backgroundColor: "#ffbe30",
    height: 40,
  },
  categoryText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  categoryTextActive: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  foodGrid: { paddingHorizontal: 16, paddingBottom: 16 },
  foodCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    margin: 8,
  },
  foodImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  foodInfo: { padding: 12 },
  foodTitle: { fontSize: 16, fontWeight: "600" },
  foodSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  rating: { marginLeft: 4, color: "#666" },
});
