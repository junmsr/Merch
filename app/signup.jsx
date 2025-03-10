import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import backgroundPattern from "../assets/images/background.png";
import cscLogo from "../assets/images/logo.png";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={backgroundPattern} style={styles.imageBackground} />
      <Image source={cscLogo} style={styles.logo} />
      <View style={styles.signupContainer}>
        <View style={styles.nameContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder='First Name' />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder='Last Name' />
          </View>
        </View>
        
        <Text style={styles.label}>Student ID</Text>
        <TextInput style={styles.input} placeholder='Student ID' />
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder='email' />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput style={styles.input} placeholder='password' secureTextEntry={!passwordVisible} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput style={styles.input} placeholder='Re-enter password' secureTextEntry={!confirmPasswordVisible} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Pressable style={styles.signupButton}>
          <Text style={styles.signupText}>SIGN UP</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logo: {
    marginTop: -150,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  signupContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    width: '48%',
  },
  label: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#ff5733',
    padding: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;
