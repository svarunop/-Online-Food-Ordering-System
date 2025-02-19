import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { StoreContext } from '../contexts/StoreContext';
import axios from 'axios';
import { assets } from '../assets/frontend_assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async () => {
    let newUrl = url;
    if (currentState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
        setShowLogin(false);
      } else {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.popup}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentState}</Text>
          <TouchableOpacity onPress={() => setShowLogin(false)}>
            <Image
              source={assets.crossIcon}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputs}>
          {currentState === 'Login' ? null : (
            <TextInput
              placeholder="Your name"
              value={data.name}
              onChangeText={(text) => setData({ ...data, name: text })}
              style={styles.input}
            />
          )}
          <TextInput
            placeholder="Your email"
            value={data.email}
            onChangeText={(text) => setData({ ...data, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Your password"
            value={data.password}
            onChangeText={(text) => setData({ ...data, password: text })}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={onLogin} style={styles.button}>
          <Text style={styles.buttonText}>
            {currentState === 'Sign Up' ? 'Create Account' : 'Login'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.condition}>
          By continuing, i agree to the terms of use & privacy policy.
        </Text>
        {currentState === 'Login' ? (
          <Text onPress={() => setCurrentState('Sign Up')} style={styles.link}>
            Create a new account?
          </Text>
        ) : (
          <Text onPress={() => setCurrentState('Login')} style={styles.link}>
            Already have an account? Login here
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  inputs: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#c9c9c9',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  condition: {
    fontSize: 14,
    color: '#808080',
    marginTop: 10,
  },
  link: {
    fontSize: 14,
    color: 'tomato',
    fontWeight: '500',
    marginTop: 10,
  },
});

export default LoginPopup;