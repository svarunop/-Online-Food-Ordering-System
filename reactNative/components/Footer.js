import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { assets } from '../assets/frontend_assets/assets';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.left}>
          <Image
            source={assets.logo}
            style={styles.logo}
          />
          <Text style={styles.text}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            nostrum iure suscipit maiores non harum incidunt unde magnam
            molestias ipsum qui vel aut natus aspernatur ipsa dignissimos,
            numquam assumenda deserunt.
          </Text>
          <View style={styles.socialIcons}>
            <Image
              source={assets.facebookIcon}
              style={styles.icon}
            />
            <Image
              source={assets.twitterIcon}
              style={styles.icon}
            />
            <Image
              source={assets.linkedinIcon}
              style={styles.icon}
            />
          </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>Company</Text>
          <Text>Home</Text>
          <Text>About us</Text>
          <Text>Delivery</Text>
          <Text>Privacy Policy</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>Get in touch</Text>
          <Text>+92-308-4900522</Text>
          <Text>contact@tomato.com</Text>
        </View>
      </ScrollView>
      <View style={styles.hr} />
      <Text style={styles.copyright}>Copyright 2024 @ Tomato.com - All Right Reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#323232',
    padding: 20,
    marginTop: 100,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  left: {
    flex: 2,
  },
  center: {
    flex: 1,
  },
  right: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  text: {
    color: '#d9d9d9',
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  hr: {
    height: 2,
    backgroundColor: 'gray',
    marginVertical: 20,
  },
  copyright: {
    color: '#d9d9d9',
    textAlign: 'center',
  },
});

export default Footer;