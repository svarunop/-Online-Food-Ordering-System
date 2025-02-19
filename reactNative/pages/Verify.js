import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Verify = ({ route }) => {
  const { url } = useContext(StoreContext);
  const navigation = useNavigation();
  const { success, orderId } = route.params || {};

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        navigation.navigate('MyOrders');
        Toast.show({
          type: 'success',
          text1: 'Order Placed Successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Verify;