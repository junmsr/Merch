import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Import the image from the assets folder
import ProfileImage from '../assets/images/Junmar.png'; // Adjust the path if necessary

const ProfileScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.profileCard}>
          <Image source={ProfileImage} style={styles.profileImage} />
          <Text style={styles.profileName}>Junmar Perez</Text>
          <Text style={styles.profileEmail}>junmarperez@gmail.com</Text>
        </LinearGradient>

        {/* My Purchases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="credit-card" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="truck" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Ship</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="package-variant" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="star" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Rate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Options</Text>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="settings" size={24} color="#8E54E9" />
            <Text style={styles.optionText}>Account Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="help-circle" size={24} color="#8E54E9" />
            <Text style={styles.optionText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="log-out" size={24} color="#8E54E9" />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home" size={28} color="#8E54E9" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart" size={28} color="#8E54E9" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={28} color="#8E54E9" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { padding: 16 },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  profileEmail: { fontSize: 14, color: 'white' },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  iconButton: { alignItems: 'center' },
  iconText: { marginTop: 5, fontSize: 14, color: '#333' },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  optionText: { marginLeft: 10, fontSize: 16, color: '#333' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#333', marginTop: 5 },
});

export default ProfileScreen;
