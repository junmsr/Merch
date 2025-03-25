import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import logoImage from '../assets/images/logo.png';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();

  // Animation references
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
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
      <Animated.Image source={logoImage} style={[styles.logo, { opacity: logoOpacity }]} />

      {/* Buttons */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonTranslateY }] }]}>
        <TouchableOpacity
          style={[styles.createAccountButton, { backgroundColor: '#4776E6' }]}
          onPress={() => router.push('/signup')}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
      </View>
    </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
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
    marginTop: -100,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountButton: {
    width: '85%',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButton: {
    width: '85%',
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginTop:20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4776E6',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WelcomeScreen;