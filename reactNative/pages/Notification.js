import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
} from "react-native";
import axios from "axios";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        checkUserAuthentication();
    }, []);

    // Check token and user authentication
    const checkUserAuthentication = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert(
                    "Login Required",
                    "You need to log in to view notifications.",
                    [{ text: "OK" }]
                );
                setLoading(false);
            } else {
                fetchNotifications(token);
            }
        } catch {
            Alert.alert("Error", "An error occurred. Please try again or relaunch the app.");
            setLoading(false);
        }
    };

    // Fetch notifications from the server
    const fetchNotifications = async (token) => {
        try {
            const response = await axios.get("http://13.61.209.211:3000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle errors, especially 400-series
    const handleFetchError = (error) => {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            Alert.alert(
                "Session Expired",
                "Your session may have expired. Please log in again.",
                [{ text: "OK" }]
            );
        } else {
            Alert.alert("Error", "An error occurred. Please try again or relaunch the app.");
        }
    };

    const handleSelectPromo = (promo) => {
        setSelectedPromo(promo);
        setModalVisible(true);
    };

    const handleApplyPromo = () => {
        if (!selectedPromo) {
            Alert.alert("Error", "No promo code selected.");
            return;
        }
        Alert.alert("Promo Code Applied", `You applied ${selectedPromo}.`);
        setModalVisible(false);
    };

    const getRemainingHours = (expires_at) => {
        const expirationTime = moment(expires_at);
        const currentTime = moment();
        const duration = moment.duration(expirationTime.diff(currentTime));
        const hoursLeft = Math.floor(duration.asHours());
        return hoursLeft > 0 ? `${hoursLeft}h left` : "Expired";
    };

    const filteredNotifications = notifications.filter((item) =>
        item.offer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Offers and Promocode</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search offers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {filteredNotifications.length === 0 ? (
                <Text style={styles.noResults}>No offers found.</Text>
            ) : (
                <FlatList
                    data={filteredNotifications}
                    keyExtractor={(item) => item.notification_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.card, item.status === 0 && styles.expiredCard]}
                            onPress={() => handleSelectPromo(item.promocode)}
                        >
                            <View style={styles.imagePlaceholder}></View>
                            <View style={styles.textContainer}>
                                <Text style={styles.offerName}>{item.offer_name}</Text>
                                <Text style={styles.discount}>Discount: {item.discount}%</Text>
                                <Text style={styles.expiry}>{getRemainingHours(item.expires_at)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
            {selectedPromo && (
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Promo Code:</Text>
                            <Text style={styles.modalCode}>{selectedPromo}</Text>
                            <TouchableOpacity style={styles.applyButton} onPress={handleApplyPromo}>
                                <Text style={styles.applyButtonText}>Apply Promo Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, marginTop:30 },
    searchBar: { backgroundColor: "#FFF", padding: 10, borderRadius: 8, marginBottom: 10 },
    noResults: { fontSize: 16, color: "#7F8C8D", marginTop: 20, textAlign: "center" },
    card: { flexDirection: "row", padding: 15, backgroundColor: "#FFF", borderRadius: 12, marginBottom: 10 },
    expiredCard: { backgroundColor: "#FFE5E5" },
    imagePlaceholder: { width: 60, height: 60, backgroundColor: "#D9D9D9", borderRadius: 10, marginRight: 15 },
    textContainer: { flex: 1 },
    offerName: { fontSize: 18, fontWeight: "bold" },
    discount: { fontSize: 16, color: "#E74C3C" },
    expiry: { fontSize: 14, color: "#7F8C8D" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "#FFF", padding: 20, borderRadius: 10 },
    modalText: { fontSize: 18, fontWeight: "bold" },
    modalCode: { fontSize: 20, color: "blue" },
    applyButton: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, marginTop: 15 },
    applyButtonText: { color: "white", fontSize: 16 },
    closeButton: { color: "red", marginTop: 10 },
});

export default NotificationScreen;
