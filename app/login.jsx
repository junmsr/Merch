import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView, Animated, Easing, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../services/firebase.config';

// @ts-ignore
import logoImage from '../assets/images/Vintage.png';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { signIn, error } = useAuth();
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

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Email and Password are required.');
        return;
    }
    try {
      const userCredential = await signIn(email, password); // Assuming signIn from useAuth returns UserCredential

      if (!userCredential || !userCredential.user) {
        Alert.alert('Login Failed', 'Could not log in. Please try again.');
        return;
      }
      const loggedInUser = userCredential.user;
      const uid = loggedInUser.uid;

      if (!uid) {
        // This case should ideally not be reached if userCredential.user exists
        Alert.alert('Login Error', 'User ID not found after login.');
        return;
      }

      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.role === 'admin' && userData.college) {
          // Navigate to AdminDashboard, passing the college as a param
          Alert.alert('Admin Login', `Welcome Admin for ${userData.college}!`); // For testing
          router.replace({ pathname: '/admin', params: { college: userData.college, adminUid: uid } });
        } else if (userData.role === 'customer') {
          // Navigate to customer dashboard or home screen
          router.replace('/dashboard'); 
        } else {
          // Role is undefined or not recognized, default to customer view or show error
          Alert.alert('Login Warning', 'User role not recognized. Defaulting to customer view.');
          router.replace('/dashboard');
        }
      } else {
        // User document doesn't exist in Firestore, though auth was successful.
        // This could be an old user or an error in signup.
        Alert.alert('Login Error', 'User profile not found. Please contact support or try signing up again.');
        // Optionally, could log them out here or redirect to signup
        // await auth.signOut(); // If you want to sign them out
        // router.replace('/signup');
      }

    } catch (err) {
      // Handle errors from signIn or getDoc
      let errorMessage = 'An unknown error occurred during login.';
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      Alert.alert('Login Error', errorMessage);
    }
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
                autoCapitalize="none"
                keyboardType="email-address"
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
    borderRadius: 100,
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
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
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