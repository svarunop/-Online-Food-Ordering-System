import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";


const OrderAnimation = () => {
    const navigation = useNavigation();
  const handleContinueOrdering = () => {
    navigation.navigate("Home");
   
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("./home-delivery.json")} // Replace with your animation file
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>Your meal is being prepared...</Text>
      <TouchableOpacity
        onPress={handleContinueOrdering}
        style={styles.continueButton}
      >
        <Text style={styles.continueText}>Continue Ordering</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  animation: { width: 300, height: 300, marginBottom: 20 },
  text: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  continueButton: {
    backgroundColor: "#ffbe30",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  continueText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default OrderAnimation;
