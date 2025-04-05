import React from 'react';
import { Button, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';

export default function App() {
  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '1894410254425601', // Replace with your Facebook App ID
      });

      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (result.type === 'success') {
        // Get user data
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${result.token}&fields=id,name,email`
        );
        const userData = await response.json();
        Alert.alert('Logged in!', `Hi ${userData.name}!`);
      } else {
        Alert.alert('Login cancelled');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return <Button title="Login with Facebook" onPress={handleFacebookLogin} />;
}
