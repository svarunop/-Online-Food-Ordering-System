import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState("");
  const uri = 'http://13.61.209.211:3000';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      console.log("Fetched user_id:", user_id);
      if (user_id) {
        setUserId(user_id);

        const response = await fetch(`${uri}/api/user/get-user/${user_id}`);
        if (!response.ok) {
          handleFetchError(response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const userData = data[0];
          setUsername(userData.username);
          setEmail(userData.email);
          setPhone(userData.phone_number);
          setImage(userData.profileImage);
        } else {
          throw new Error("No user data found");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data. Please try again later.");
    }
  };

  const handleFetchError = (status) => {
    if (status >= 400 && status < 500) {
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [{ text: "OK"}]
      );
    } else {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Alert.alert("Profile Updated", "Your changes have been saved successfully!", [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);
  };


  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user_id");
  
            // Ensure navigation back to the login screen before closing
            navigation.navigate("Login");
  
            // Close the app (works on Android)
            setTimeout(() => {
              BackHandler.exitApp();
            }, 1000); // Small delay to ensure navigation completes before closing
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Ionicons name="camera" size={30} color="#666" />
            <Text style={styles.uploadText}>Tap to upload</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          keyboardType="phone-pad"
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 100,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 12,
    color: "#666",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#EE3A3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
