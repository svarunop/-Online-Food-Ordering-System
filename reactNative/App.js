global.setTimeout = global.setTimeout || require('timers').setTimeout;
global.clearTimeout = global.clearTimeout || require('timers').clearTimeout;
global.fetch = global.fetch || require('node-fetch');
global.Headers = global.Headers || require('node-fetch').Headers;
global.Request = global.Request || require('node-fetch').Request;
global.Response = global.Response || require('node-fetch').Response;
global.AbortController = global.AbortController || require('abort-controller');

import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './pages/Home';
import ProfileScreen from './pages/profile';
import CartScreen from './pages/Cart';
import FavoritesScreen from './pages/FavoritesScreen';
import RestaurantsScreen from "./pages/RestaurantsScreen";
import MenuScreen from "./pages/MenuScreen";
import LoginScreen from "./pages/login";
import Register from "./pages/register";
import ConfirmOrder from "./pages/ConfirmOrder";
import OrderAnimation from "./pages/OrderAnimation";
import Notification from "./pages/Notification";
import SplashScreen from "./pages/SplashScreen";
import 'react-native-polyfill-globals/auto';

import StoreContextProvider, { StoreContext } from './contexts/StoreContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// **Restaurant Stack 
const RestaurantStack = () => (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>

    <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
    <Stack.Screen name="MenuScreen" component={MenuScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
  {/* <Stack.Screen name="Checkout" component={Checkout} /> */}
  <Stack.Screen name="OrderAnimation" component={OrderAnimation} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Notification" component={Notification} />
  <Stack.Screen name="SplashScreen" component={SplashScreen} />
  </Stack.Navigator>
);

//Bottom Tab Nav
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Restaurants: "map-pin",
            "Cart Item": "shopping-cart",
            Favourites: "heart",
            Offers: "tag", 
          };
          
          return <Feather name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#EE3A3A",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantStack} />
      <Tab.Screen name="Favourites" component={FavoritesScreen} />
      <Tab.Screen name="Cart Item" component={CartScreen} />
      <Tab.Screen name="Offers" component={Notification} />

    </Tab.Navigator>
  );
};

// **Main Nav Stack
const MainNavigator = () => {
  const { token } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setUserToken(storedToken);
      setLoading(false);
    };
    checkLoginStatus();
  }, [token]);

  if (loading) return null; 

  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
        
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
          {/* <Stack.Screen name="Checkout" component={Checkout} /> */}
          <Stack.Screen name="OrderAnimation" component={OrderAnimation} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={BottomTabNavigator} />
        </>
      ) : (
        <>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="OrderAnimation" component={OrderAnimation} />
          <Stack.Screen name="Notification" component={Notification} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <StoreContextProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </StoreContextProvider>
  );
}