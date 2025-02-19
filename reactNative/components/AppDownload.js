import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AppDownload = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>For Better Experience Download Tomato App</Text>
      <View style={styles.platforms}>
        <TouchableOpacity style={styles.imageContainer}>
          <Image
            source={require('../assets/frontend_assets/play_store.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageContainer}>
          <Image
            source={require('../assets/frontend_assets/app_store.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  platforms: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
  },
  imageContainer: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default AppDownload;