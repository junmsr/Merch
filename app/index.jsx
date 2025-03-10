import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import backgroundPattern from '@/assets/images/background.png';
import cscLogo from '@/assets/images/logo.png';

const App = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundPattern} resizeMode='cover' style={styles.image}>
        <Image source={cscLogo} style={styles.logo} />
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Log In</Text>
          
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder='username'
            value={email}
            onChangeText={setEmail}
          />
          
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder='password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginText}>LOGIN</Text>
          </Pressable>
          
          <View style={styles.divider}></View>
          
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity>
              <Image source={require('../assets/images/facebook.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../assets/images/google.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.signUpText}>New to CS Merch? <Link href="signup" style={styles.signUpLink} >Sign up</Link></Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  loginContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
    marginTop: 5,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#ff5733',
    padding: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpText: {
    marginTop: 10,
    fontSize: 14,
  },
  signUpLink: {
    color: '#ff5733',
    fontWeight: 'bold',
  },
});

export default App;