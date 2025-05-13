import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
// @ts-ignore
import logoImage from '../assets/images/Vintage.png';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 2000); // Wait 2 seconds before transitioning
    });
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={logoImage}
        style={[styles.splashLogo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
      />
    </View>
  );
};

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const glitchTranslateX = useRef(new Animated.Value(0)).current;
  const glitchTranslateY = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isLoading) {
      const glitchInterval = setInterval(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glitchTranslateX, {
              toValue: Math.random() * 10 - 5, // Random horizontal shift
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(glitchTranslateY, {
              toValue: Math.random() * 10 - 5, // Random vertical shift
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(glitchOpacity, {
              toValue: Math.random() > 0.5 ? 0.7 : 1, // Random opacity flicker
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glitchTranslateX, {
              toValue: 0, // Reset horizontal shift
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(glitchTranslateY, {
              toValue: 0, // Reset vertical shift
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(glitchOpacity, {
              toValue: 1, // Reset opacity
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, 500); // Glitch effect every 500ms

      return () => clearInterval(glitchInterval); // Cleanup interval on unmount
    }
  }, [isLoading]);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

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

        {/* Logo and Title Container */}
        <View style={styles.logoTitleContainer}>
          <Animated.Image source={logoImage} style={[styles.logo]} />
          <View style={styles.verticalDivider} />
          <Animated.Text
            style={[
              styles.titleText,
              {
                transform: [
                  { translateX: glitchTranslateX },
                  { translateY: glitchTranslateY },
                ],
              },
              { opacity: glitchOpacity },
            ]}
          >
            CShop
          </Animated.Text>
        </View>

        {/* Buttons */}
        <Animated.View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createAccountButton, { backgroundColor: '#4776E6' }]}
            onPress={() => router.push('/signup')}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Create Account</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 CShop. All rights reserved.</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4776E6',
  },
  splashLogo: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    justifyContent: 'space-between',
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
    marginBottom: 0,
    marginTop: 300,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: 100,
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
    marginTop: 20,
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
  divider: {
    width: '85%',
    height: 1,
    padding: 1,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginVertical: 10,
    opacity: 0.3,
  },
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -50,
  },
  verticalDivider: {
    width: 1,
    height: 130,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 290,
    padding: 2,
    borderRadius: 10,
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    color: 'white',
    marginTop: 290,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

export default WelcomeScreen; 
