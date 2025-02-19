import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Or 'MainTabs' if already logged in
    }, 1000);

    // Clear timer when component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <Text style={styles.footer}>Made with ❤️ by Vrushabh!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
