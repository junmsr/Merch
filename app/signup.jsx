import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import backgroundPattern from "../assets/images/background.png";
import cscLogo from "../assets/images/logo.png";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundPattern} style={styles.imageBackground}>
        <View style={styles.overlay}>
          <Image source={cscLogo} style={styles.logo} />
          <View style={styles.signupContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <View style={styles.nameContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} placeholder='First Name' placeholderTextColor="#aaa" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} placeholder='Last Name' placeholderTextColor="#aaa" />
              </View>
            </View>

            <Text style={styles.label}>Student ID</Text>
            <TextInput style={styles.input} placeholder='Student ID' placeholderTextColor="#aaa" />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder='Email' placeholderTextColor="#aaa" />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.input} placeholder='Password' placeholderTextColor="#aaa" secureTextEntry={!passwordVisible} />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.input} placeholder='Re-enter Password' placeholderTextColor="#aaa" secureTextEntry={!confirmPasswordVisible} />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <Pressable style={styles.signupButton}>
              <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.signupGradient}>
                <Text style={styles.signupText}>SIGN UP</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  signupContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputWrapper: {
    width: '48%',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  signupButton: {
    width: '100%',
    borderRadius: 25,
    marginTop: 20,
    overflow: 'hidden',
  },
  signupGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;