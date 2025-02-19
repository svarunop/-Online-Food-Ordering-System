import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { StoreContext } from "../contexts/StoreContext";

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  // const uri = useContext(StoreContext);
  const uri = 'http://13.61.209.211:3000';

  const handleRegister = async () => {
    if (!username || !email || !password ) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    try {
      const response = await axios.post(`${uri}/api/auth/register`, {
        username: username,
        email:email,
        password:password,
        mobile:mobile,
      });
      Alert.alert('Success', 'Registration successful!');
      props.navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error:", error.response);
      Alert.alert('Error', error.response?.data || 'Error registering user.');
    }
  };

  const login = () => {
    props.navigation.navigate("Login");


  };

  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <View style={styles.tabContainer}>
      <TouchableOpacity onPress={login}>
        <Text style={styles.inactiveTab}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.activeTab}>Sign-up</Text>
      </View>

      <Text style={styles.title}>Register Here</Text>

      <TextInput
        label="User Name"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        mode="outlined"
        secureTextEntry={secureTextEntry}
        right={<TextInput.Icon 
                icon="eye" 
                onPress={() => setSecureTextEntry(!secureTextEntry)} 
              />}
      />

      <TextInput
        label="Phone"
        value={mobile}
        onChangeText={text => setMobile(text)}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
     
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
      >
        Register Me
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  inactiveTab: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
    paddingBottom: 10,
  },
  activeTab: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'orange',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  }
});

export default Register;
