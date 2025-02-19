import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; // Importing icon library

const RestaurantsScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const uri = 'http://13.61.209.211:3000';

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${uri}/api/user/get-restaurants`);
      setRestaurants(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (error) => {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }]
      );
    } else {
      Alert.alert(
        "Error",
        "Something went wrong. Please try again later or relaunch the app.",
        [{ text: "OK" }]
      );
    }
    setRestaurants([]); // Ensure the UI doesn't break
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#EE3A3A" style={styles.loadingIndicator} />;
  }

  if (restaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRestaurantsText}>No restaurants found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Top Restaurant</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => (item?.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log("Navigating with restaurantId:", item.id);
              navigation.navigate("MenuScreen", { restaurantId: item.id });
            }}
            style={styles.restaurantItem}
          >
            <View style={styles.restaurantInfo}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="cutlery" size={20} color="#333" style={{ marginRight: 8 }} />
                <Text style={styles.restaurantName}>{item?.name || "Unknown"}</Text>
              </View>
              <Text style={styles.restaurantDescription}>{item?.description || "No description available"}</Text>
              <Text style={styles.restaurantAddress}>{item?.address || "No address available"}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  headerText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  noRestaurantsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  restaurantItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  restaurantInfo: {
    flexDirection: 'column',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantDescription: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
  },
  restaurantAddress: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default RestaurantsScreen;
