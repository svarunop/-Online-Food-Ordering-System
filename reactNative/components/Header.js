import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ToastAndroid, ScrollView, FlatList } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import { assets } from '../assets/frontend_assets/assets';

import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';

const menuItems = ['home', 'menu', 'mobile-app', 'contact-us'];

const Navbar = ({ setShowLogin }) => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState('home');
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    ToastAndroid.show('Logout Successful', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.navbar}>
      {/* Left: Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={assets.logo} style={styles.logo} />
      </TouchableOpacity>

      {/* Center: Scrollable Navigation Menu */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item} onPress={() => setMenu(item)} style={[styles.menuItem, menu === item && styles.active]}>
            <Text style={[styles.menuText, menu === item && styles.activeText]}>{item.replace('-', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Right: Icons Section */}
      <View style={styles.right}>
        <IconButton icon="magnify" size={24} onPress={() => {}} />

        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartContainer}>
          <IconButton icon="cart-outline" size={24} />
          {getTotalCartAmount() > 0 && <View style={styles.dot} />}
        </TouchableOpacity>

        {!token ? (
          <TouchableOpacity onPress={() => setShowLogin(true)}>
            <Text style={styles.signIn}>Sign In</Text>
          </TouchableOpacity>
        ) : (
          <IconButton icon="account-circle-outline" size={24} onPress={logout} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    marginLeft:-20,
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  menu: {
    flexDirection: 'row',
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  menuItem: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textTransform: 'capitalize',
  },
  active: {
    borderBottomWidth: 3,
    borderBottomColor: '#49557e',
    paddingBottom: 5,
  },
  activeText: {
    color: '#49557e',
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartContainer: {
    position: 'relative',
  },
  signIn: {
    color: '#49557e',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#49557e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default Navbar;
