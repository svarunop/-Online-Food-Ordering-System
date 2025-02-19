// pages/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './Home';
import CartScreen from '../components/Cart';
import FavoritesScreen from './FavoritesScreen';
// import RestaurantStack from './RestaurantStack'; // Your existing restaurant stack

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Restaurants: "map-pin",
            Cart: "shopping-bag",
            Favorites: "heart",
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
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;