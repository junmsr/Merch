import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import logoImage from '../assets/images/logo.png';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Animation references
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const inputCardTranslateY = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(inputCardTranslateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <LinearGradient colors={['#4776E6', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.waveContainer}>
            <Svg height="500" width={width} viewBox="0 0 390 10" style={styles.wave}>
              <Path
                fill="#4776E6"
                d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
            </Svg>
          </View>

          <Animated.Image source={logoImage} style={[styles.logo, { opacity: logoOpacity }]} />

          <Animated.View style={[styles.inputCard, { transform: [{ translateY: inputCardTranslateY }] }]}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.7}
              onPressIn={() => Animated.spring(buttonScale, { toValue: 0.9, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start()}
            >
              <Animated.Text style={[styles.loginButtonText, { transform: [{ scale: buttonScale }] }]}>
                LOGIN
              </Animated.Text>
            </TouchableOpacity>
            <View style={styles.divider}>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={[styles.socialIconWrapper, { backgroundColor: '#3b5998' }]}>
              <Ionicons name="logo-facebook" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIconWrapper, { backgroundColor: '#db4437' }]}>
              <Ionicons name="logo-google" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          </Animated.View>

          <Text style={styles.signUpText}>
            New to CS Merch?{' '}
            <Text style={styles.signUpLink} onPress={() => router.push('/signup')}>
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  waveContainer: {
    position: 'absolute',
    top: -250,
    width: '100%',
    height: 500,
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
    backdropFilter: 'blur(10px)',
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
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
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
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  divider: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 16,
    color: '#666',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: -10,
  },
  socialIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  signUpLink: {
    color: '#4776E6',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
