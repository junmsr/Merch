import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Pressable, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import cscLogo from "../assets/images/logo.png";

const { width } = Dimensions.get('window');

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignup = async () => {
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
      console.log('Response:', data); // Log the response
  
      if (response.ok) {
        alert(data.message); // Show success message
      } else {
        alert(data.error); // Show error message
      }
    } catch (error) {
      console.error('Error during signup:', error); // Log any errors
      alert('An error occurred during signup. Please try again.', error); // Show error message
    }
  };
  // Animation references
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
          <Image source={cscLogo} style={styles.logo} />
          <View style={styles.signupContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <View style={styles.nameContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder='First Name'
                  placeholderTextColor="#aaa"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Last Name'
                  placeholderTextColor="#aaa"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              placeholder='Student ID'
              placeholderTextColor="#aaa"
              value={studentId}
              onChangeText={setStudentId}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder='Email'
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder='Password'
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
                placeholder='Re-enter Password'
                placeholderTextColor="#aaa"
                secureTextEntry={!confirmPasswordVisible}
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
      {/* Wave Background */}
      <View style={styles.waveContainer}>
        <Svg height="500" width={width} viewBox="0 0 390 10" style={styles.wave}>
          <Path
            fill="#4776E6"
            d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>
      </View>

      {/* Logo */}
      <Animated.Image source={cscLogo} style={[styles.logo, { opacity: logoOpacity }]} />

      {/* Signup Form */}
      <Animated.View style={[styles.inputCard, { transform: [{ translateY: formTranslateY }] }]}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.nameContainer}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" />
              
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" />
          </View>
        </View>

        <TextInput style={styles.input} placeholder="Student ID" placeholderTextColor="#aaa" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Pressable style={styles.signupButton}>
          
            <Text style={styles.signupText}>SIGN UP</Text>

        </Pressable>
      </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    top: -250,
    width: '100%',
    height: 500,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  wave: {
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 9,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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