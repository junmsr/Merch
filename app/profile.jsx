import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import ProfileImage from '../assets/images/Junmar.png';
import SampleProductImage from '../assets/images/Junmar.png'; // Replace with your sample product image path

const ProfileScreen = () => {
  const router = useRouter();

  const profileCardAnimation = useRef(new Animated.Value(0)).current;

  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  const opacityHome = useRef(new Animated.Value(1)).current;
  const opacityCart = useRef(new Animated.Value(0.5)).current;
  const opacityProfile = useRef(new Animated.Value(1)).current;

  const [activeTab, setActiveTab] = useState('profile');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    Animated.timing(profileCardAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = (scaleRef, opacityRef, route, tabName) => {
    Animated.timing(opacityHome, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacityCart, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacityProfile, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();

    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleRef, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(opacityRef, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    setActiveTab(tabName);

    if (route) router.push(route);
  };

  const openModal = (section) => {
    let content = '';
    switch (section) {
      case 'To Pay':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Pay" section.</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'To Ship':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Ship" section.</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Contact Seller</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'To Receive':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Receive" section.</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Confirm Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'To Rate':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Rate" section.</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Rate Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Write Review</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      default:
        content = <Text>No content available</Text>;
    }
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.profileCard, { opacity: profileCardAnimation, transform: [{ scale: profileCardAnimation }] }]}>
          <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.profileCardGradient}>
            <Image source={ProfileImage} style={styles.profileImage} />
            <Text style={styles.profileName}>Junmar Perez</Text>
            <Text style={styles.profileEmail}>junmarperez@gmail.com</Text>
          </LinearGradient>
        </Animated.View>
       
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton} onPress={() => openModal('To Pay')}>
              <MaterialCommunityIcons name="credit-card" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => openModal('To Ship')}>
              <MaterialCommunityIcons name="truck" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Ship</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => openModal('To Receive')}>
              <MaterialCommunityIcons name="package-variant" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => openModal('To Rate')}>
              <MaterialCommunityIcons name="star" size={24} color="#8E54E9" />
              <Text style={styles.iconText}>To Rate</Text>
            </TouchableOpacity>
          </View>

          {/* Product Grid */}
          <View style={styles.productGrid}>
            <TouchableOpacity style={styles.productCard} onPress={() => openModal('To Pay')}>
              <Image source={SampleProductImage} style={styles.productImage} />
              <Text style={styles.productName}>Sample Product 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard} onPress={() => openModal('To Ship')}>
              <Image source={SampleProductImage} style={styles.productImage} />
              <Text style={styles.productName}>Sample Product 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard} onPress={() => openModal('To Receive')}>
              <Image source={SampleProductImage} style={styles.productImage} />
              <Text style={styles.productName}>Sample Product 3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard} onPress={() => openModal('To Rate')}>
              <Image source={SampleProductImage} style={styles.productImage} />
              <Text style={styles.productName}>Sample Product 4</Text>
            </TouchableOpacity>
          </View>
        </View>

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

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handlePress(scaleHome, opacityHome, '/dashboard', 'home')}
        >
          <Animated.View style={{ transform: [{ scale: scaleHome }] }}>
            <Ionicons name="home" size={28} color={activeTab === 'home' ? '#8E54E9' : '#888'} />
          </Animated.View>
          <Animated.Text style={[styles.navText, { opacity: opacityHome }]}>Home</Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handlePress(scaleCart, opacityCart, '/cart', 'cart')}
        >
          <Animated.View style={{ transform: [{ scale: scaleCart }] }}>
            <Ionicons name="cart" size={28} color={activeTab === 'cart' ? '#8E54E9' : '#888'} />
          </Animated.View>
          <Animated.Text style={[styles.navText, { opacity: opacityCart }]}>Cart</Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handlePress(scaleProfile, opacityProfile, '/profile', 'profile')}
        >
          <Animated.View style={{ transform: [{ scale: scaleProfile }] }}>
            <Ionicons name="person" size={28} color={activeTab === 'profile' ? '#8E54E9' : '#888'} />
          </Animated.View>
          <Animated.Text style={[styles.navText, { opacity: opacityProfile }]}>Profile</Animated.Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalContent}
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileCardGradient: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: '100%',
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
  productRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  productImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 10 },
  productName: { fontSize: 14, color: '#333' },
  productDetails: { alignItems: 'center' },
  productDescription: { fontSize: 14, color: '#333', marginTop: 10, textAlign: 'center' },
  modalButton: {
    flex: 1,
    backgroundColor: '#8E54E9',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    maxWidth: '45%', // Ensure buttons do not exceed 45% of the modal width
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#8E54E9',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});

export default ProfileScreen;