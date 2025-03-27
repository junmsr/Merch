import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Pressable, Dimensions, Animated, Easing, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import cscLogo from "../assets/images/logo.png";
import backgroundPattern from "../assets/images/background-pattern.png";

const { width } = Dimensions.get('window');

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://10.10.58.188:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          student_id: studentId,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#4776E6', '#fff']} style={styles.gradient}>
      <View style={styles.container}>
        <ImageBackground source={backgroundPattern} style={styles.imageBackground}>
          <View style={styles.overlay}>
            <Animated.Image source={cscLogo} style={[styles.logo, { opacity: logoOpacity }]} />
            <Animated.View style={[styles.inputCard, { transform: [{ translateY: formTranslateY }] }]}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              <View style={styles.nameContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#aaa"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Student ID"
                placeholderTextColor="#aaa"
                value={studentId}
                onChangeText={setStudentId}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
              </View>

              <Pressable style={styles.signupButton} onPress={handleSignup}>
                <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.signupGradient}>
                  <Text style={styles.signupText}>SIGN UP</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        </ImageBackground>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  inputCard: {
    width: '89%',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  inputWrapper: {
    width: '48%',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#4776E6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signupGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Signup;