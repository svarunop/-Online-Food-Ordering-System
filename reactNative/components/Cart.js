import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const {
    foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    if (cartItems[item._id] > 0) {
      return (
        <View style={styles.item}>
          <Image
            source={{ uri: `${url}/images/${item.image}` }}
            style={styles.image}
          />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.quantity}>{cartItems[item._id]}</Text>
          <Text style={styles.total}>${item.price * cartItems[item._id]}</Text>
          <TouchableOpacity
            onPress={() => removeFromCart(item._id)}
            style={styles.remove}
          >
            <Text>x</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={foodList}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Items</Text>
            <Text style={styles.headerText}>Title</Text>
            <Text style={styles.headerText}>Price</Text>
            <Text style={styles.headerText}>Quantity</Text>
            <Text style={styles.headerText}>Total</Text>
            <Text style={styles.headerText}>Remove</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.bottom}>
        <View style={styles.totalContainer}>
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
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaceOrder')}
          style={styles.checkoutButton}
        >
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: 'gray',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  name: {
    flex: 1,
  },
  price: {
    flex: 1,
  },
  quantity: {
    flex: 1,
  },
  total: {
    flex: 1,
  },
  remove: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e2e2',
    marginVertical: 10,
  },
  bottom: {
    marginTop: 80,
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 24,
    fontWeight: '600',
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
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Cart;