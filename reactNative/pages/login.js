import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const uri = 'http://13.61.209.211:3000';

  const handleLogin = async () => {
    try {
        const response = await fetch(`${uri}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            Alert.alert('Login Failed', data.message || 'Invalid credentials');
            return;
        }

        console.log('Login Response:', data);

        // Store data for future use
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user_id', String(data.user_id));
        await AsyncStorage.setItem('username', data.username);
        await AsyncStorage.setItem('role', data.role);

        Alert.alert('Login Successful', `Welcome, ${data.username}!`);
        props.navigation.navigate('MainTabs'); // Navigate to main screen
    } catch (error) {
        console.error('Login Error:', error);
        Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
    }
};


  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <View style={styles.tabContainer}>
        <Text style={styles.activeTab}>Login</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
          <Text style={styles.inactiveTab}>Sign-up</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry={secureTextEntry}
        right={<TextInput.Icon icon="eye" onPress={() => setSecureTextEntry(!secureTextEntry)} />}
      />
      <Text style={styles.forgotPassword}>Forgot passcode?</Text>
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.login}>Login</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#ffffff' },
  login: { color: 'purple', fontWeight: 'bold' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  activeTab: { fontSize: 18, fontWeight: 'bold', color: 'orange' },
  inactiveTab: { fontSize: 18, fontWeight: 'bold', color: '#999999' },
  input: { marginBottom: 20, backgroundColor: 'white' },
  forgotPassword: { textAlign: 'right', color: 'orange', marginBottom: 20 },
  loginButton: { backgroundColor: 'orange', borderRadius: 20, paddingVertical: 10 },
});

export default LoginPage;
