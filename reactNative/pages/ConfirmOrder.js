import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { StoreContext } from "../contexts/StoreContext"; 
const OrderConfirmation = ({ cartItems, foodList }) => {
  // const { totalAmount } = useContext(StoreContext);
  const { totalAmount } = useContext(StoreContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [upiId, setUpiId] = useState(""); // For UPI input
  const navigation = useNavigation();

  // Fetch Real-Time Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setDeliveryAddress("Permission to access location was denied.");
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        let { latitude, longitude } = location.coords;

        // Reverse geocoding
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const { city, region, street } = reverseGeocode[0];
          setDeliveryAddress(`${street || "Street"}, ${city || "City"}, ${region || "Region"}`);
        } else {
          setDeliveryAddress(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error("Error fetching location or address:", error);
        setDeliveryAddress("Unable to fetch address.");
      }
    })();
  }, []);

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (selectedPaymentMethod === "UPI" && upiId.trim() === "") {
      alert("Please enter your UPI ID.");
      return;
    }

    // Payment logic here
    setModalVisible(false);
    navigation.navigate("OrderAnimation"); // Navigate to OrderAnimation page
  };

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm Order</Text>
      </TouchableOpacity>

      {/* Order Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Payment Methods */}
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            {["Cash on Delivery (COD)", "UPI"].map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paymentOption,
                  selectedPaymentMethod === method && styles.selectedPaymentOption,
                ]}
                onPress={() => {
                  setSelectedPaymentMethod(method);
                  if (method !== "UPI") setUpiId(""); 
                }}
              >
                <Text style={styles.paymentText}>{method}</Text>
              </TouchableOpacity>
            ))}

            {/* UPI Input */}
            {selectedPaymentMethod === "UPI" && (
              <TextInput
                style={styles.input}
                placeholder="Enter your UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                keyboardType="email-address"
              />
            )}

            {/* Delivery Address */}
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.deliverySection}>
              <Text style={styles.addressText}>
                {deliveryAddress || "Fetching location..."}
              </Text>
            </View>

            {/* Order Summary */}
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.deliveryDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>₹{totalAmount}</Text>
              </View>
            </View>

            {/* Payment Button */}
            <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
              <Text style={styles.paymentButtonText}>Make a Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  confirmButton: {
    backgroundColor: "#ffbe30",
    padding: 15,
    borderRadius: 10,
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  paymentOption: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
  },
  selectedPaymentOption: {
    backgroundColor: "#ffbe30",
  },
  paymentText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  deliverySection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
  },
  deliveryDetails: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentButton: {
    backgroundColor: "#ffbe30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrderConfirmation;
