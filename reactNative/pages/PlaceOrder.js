import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
// const uri = useContext(StoreContext);
const uri = 'http://13.61.209.211:3000';

const PlaceOrder = () => {
  const navigation = useNavigation();
  const {
    getTotalCartAmount,
    token,
    foodList,
    cartItems,
    url,
  } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const placeOrder = async () => {
    try {
      let orderItems = [];
      foodList.forEach(item => {
        if (cartItems[item._id] > 0) {
          let itemInfo = item;
          itemInfo.quantity = cartItems[item._id];
          orderItems.push(itemInfo);
        }
      });
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };
      const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
      if (response.data.success) {
        const { session_url } = response.data;
        navigation.navigate('Verify', { session_url });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error placing order',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error placing order',
      });
    }
  };

  useEffect(() => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Please login first',
      });
      navigation.goBack();
    } else if (getTotalCartAmount() === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please add items to cart',
      });
      navigation.goBack();
    }
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>Delivery Information</Text>
        <View style={styles.multiFields}>
          <TextInput
            placeholder="First name"
            value={data.firstName}
            onChangeText={value => onChangeHandler('firstName', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={data.lastName}
            onChangeText={value => onChangeHandler('lastName', value)}
            style={styles.input}
          />
        </View>
        <TextInput
          placeholder="Email Address"
          value={data.email}
          onChangeText={value => onChangeHandler('email', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Street"
          value={data.street}
          onChangeText={value => onChangeHandler('street', value)}
          style={styles.input}
        />
        <View style={styles.multiFields}>
          <TextInput
            placeholder="City"
            value={data.city}
            onChangeText={value => onChangeHandler('city', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="State"
            value={data.state}
            onChangeText={value => onChangeHandler('state', value)}
            style={styles.input}
          />
        </View>
        <View style={styles.multiFields}>
          <TextInput
            placeholder="Zip Code"
            value={data.zipcode}
            onChangeText={value => onChangeHandler('zipcode', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Country"
            value={data.country}
            onChangeText={value => onChangeHandler('country', value)}
            style={styles.input}
          />
        </View>
        <TextInput
          placeholder="Phone"
          value={data.phone}
          onChangeText={value => onChangeHandler('phone', value)}
          style={styles.input}
        />
      </View>
      <View style={styles.right}>
        <Text style={styles.totalText}>Cart Totals</Text>
        <View style={styles.totalDetails}>
          <Text>Subtotals</Text>
          <Text>${getTotalCartAmount()}</Text>
        </View>
        <View style={styles.totalDetails}>
          <Text>Delivery Fee</Text>
          <Text>${getTotalCartAmount() === 0 ? 0 : 2}</Text>
        </View>
        <View style={styles.totalDetails}>
          <Text>Total</Text>
          <Text>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</Text>
        </View>
        <TouchableOpacity onPress={placeOrder} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>PROCEED TO PAYMENT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    padding: 20,
  },
  left: {
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 50,
  },
  input: {
    marginBottom: 15,
    width: '100%',
    padding: 10,
    borderColor: '#c5c5c5',
    borderWidth: 1,
    borderRadius: 4,
  },
  multiFields: {
    flexDirection: 'row',
    gap: 10,
  },
  right: {
    width: '100%',
    maxWidth: 500,
  },
  totalText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  totalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 30,
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PlaceOrder;