import React, { useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StoreContext } from "../contexts/StoreContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useContext(StoreContext);
  const uri = 'http://13.61.209.211:3000';

  return (
    <View style={styles.container}>
       <Text style={styles.headerText}>favorite Items</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/empty_favorites.png")} // Add an image in assets
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No favorites yet.</Text>
          <Text style={styles.emptySubText}>Tap the heart to add items to your favorites.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.item_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                source={{ uri: `${uri}/public/${item.image}` }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.ratingContainer}>
                  <AntDesign name="star" size={16} color="#FFB800" />
                  <Text style={styles.rating}>4.9</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.item_id)} style={styles.removeButton}>
                <Ionicons name="heart-dislike-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    marginTop:30,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#666", marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  rating: { marginLeft: 4, fontSize: 14, color: "#666" },
  removeButton: { padding: 10 },
  
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImage: { width: 200, height: 200, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  emptySubText: { fontSize: 14, color: "#666", textAlign: "center", marginHorizontal: 30 },
});

export default FavoritesScreen;
