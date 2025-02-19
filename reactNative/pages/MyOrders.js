import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import axios from 'axios';
// import { assets } from '../assets';
import Toast from 'react-native-toast-message';
// const uri = useContext(StoreContext);
const uri = 'http://13.61.209.211:3000';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching orders',
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <Image
              source={assets.parcelIcon}
              style={styles.icon}
            />
            <Text style={styles.orderText}>
              {item.items.map((item, index) => {
                if (index === item.items.length - 1) {
                  return `${item.name} X ${item.quantity}`;
                } else {
                  return `${item.name} X ${item.quantity}, `;
                }
              })}
            </Text>
            <Text style={styles.orderText}>${item.amount}.00</Text>
            <Text style={styles.orderText}>items: {item.items.length}</Text>
            <Text style={styles.orderText}>
              <Text style={styles.statusDot}>&#x25cf;</Text>
              <Text style={styles.statusText}> {item.status}</Text>
            </Text>
            <TouchableOpacity onPress={fetchOrders} style={styles.button}>
              <Text style={styles.buttonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  orderText: {
    flex: 1,
    fontSize: 14,
    color: '#454545',
  },
  statusDot: {
    color: 'tomato',
  },
  statusText: {
    fontWeight: '500',
    color: '#454545',
  },
  button: {
    backgroundColor: '#ffe1e1',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#454545',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e2e2',
    marginVertical: 10,
  },
});

export default MyOrders;