import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import ProfileImage from '../assets/images/Junmar.png';
import SampleProductImage from '../assets/images/Junmar.png'; // Replace with your sample product image path

const ProfileScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
  const [accountSettingsModalVisible, setAccountSettingsModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // Track the active section
  const slideAnimation = useRef(new Animated.Value(-300)).current; // Initial position off-screen
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Simulate resource loading (e.g., fetching data or assets)
    const loadResources = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second loading time
      setIsLoading(false); // Set loading to false once resources are ready
    };

    loadResources();
  }, []);

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
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Pay Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      case 'To Ship':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Ship" section.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Contact Seller</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      case 'To Receive':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Receive" section.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Confirm Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      case 'To Rate':
        content = (
          <View style={styles.productDetails}>
            <Image source={SampleProductImage} style={styles.productImage} />
            <Text style={styles.productName}>Sample Product</Text>
            <Text style={styles.productDescription}>This is a sample product description for the "To Rate" section.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Rate Product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Write Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
      default:
        content = <Text>No content available</Text>;
    }
    setModalContent(content);
    setModalVisible(true);
  };

  const openAccountSettingsModal = () => {
    setAccountSettingsModalVisible(true);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleSectionPress = (section) => {
    if (activeSection === section) {
      // Close the section if it's already active
      Animated.timing(slideAnimation, {
        toValue: -300, // Slide out of view
        duration: 300,
        useNativeDriver: true,
      }).start(() => setActiveSection(null)); // Reset activeSection after animation
    } else {
      // Open the section
      setActiveSection(section); // Set the active section
      Animated.timing(slideAnimation, {
        toValue: 0, // Slide into view
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderProducts = (section) => {
    if (activeSection !== section) return null; // Only render products for the active section
  
    // Sample product data
    const products = [
      { id: 1, name: 'Product 1', description: 'Description for Product 1', image: SampleProductImage },
      { id: 2, name: 'Product 2', description: 'Description for Product 2', image: SampleProductImage },
      { id: 3, name: 'Product 3', description: 'Description for Product 3', image: SampleProductImage },
      { id: 4, name: 'Product 4', description: 'Description for Product 4', image: SampleProductImage },
    ];
  
    return (
      <Animated.View style={[styles.productContainer, { transform: [{ translateX: slideAnimation }] }]}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productDetails}>
              <Image source={product.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
              </View>
            </View>
  
            {/* Functional Buttons */}
            {section === 'To Pay' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => alert(`Pay for ${product.name}`)}>
                <Text style={styles.actionButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            {section === 'To Ship' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => alert(`Track ${product.name}`)}>
                <Text style={styles.actionButtonText}>Track Order</Text>
              </TouchableOpacity>
            )}
            {section === 'To Receive' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => alert(`Confirm receipt of ${product.name}`)}>
                <Text style={styles.actionButtonText}>Confirm Receipt</Text>
              </TouchableOpacity>
            )}
            {section === 'To Rate' && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Rate this Product:</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => alert(`Rated ${star} Stars for ${product.name}`)}>
                      <Ionicons name="star" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Use the Vintage.png logo */}
        <Image source={require('../assets/images/Vintage.png')} style={styles.loadingLogo} />
        <Text style={styles.loadingText}>Loading resources...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            { opacity: profileCardAnimation, transform: [{ scale: profileCardAnimation }] },
          ]}
        >
          <View style={styles.profileCardSolid}>
            <Image source={ProfileImage} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Junmar Perez</Text>
              <Text style={styles.profileEmail}>junmarperez@gmail.com</Text>
            </View>
          </View>
        </Animated.View>

        {/* My Purchases Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {['To Pay', 'To Ship', 'To Receive', 'To Rate'].map((section) => (
              <TouchableOpacity
                key={section}
                style={[
                  styles.purchaseCard,
                  activeSection === section && styles.activePurchaseCard,
                ]}
                onPress={() => handleSectionPress(section)}
              >
                <MaterialCommunityIcons
                  name={section === 'To Pay' ? 'credit-card' : section === 'To Ship' ? 'truck' : section === 'To Receive' ? 'package-variant' : 'star'}
                  size={32}
                  color={activeSection === section ? '#4776E6' : '#888'}
                />
                <Text style={styles.purchaseText}>{section}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {activeSection && renderProducts(activeSection)}
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Options</Text>
          <TouchableOpacity style={styles.option} onPress={openAccountSettingsModal}>
            <Ionicons name="settings" size={24} color="#4776E6" />
            <Text style={styles.optionText}>Account Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="help-circle" size={24} color="#4776E6" />
            <Text style={styles.optionText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#4776E6" />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
     <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handlePress(scaleHome, opacityHome, '/dashboard', 'home')}
            >
              <Animated.View style={{ transform: [{ scale: scaleHome }] }}>
                <Ionicons name="home" size={28} color={activeTab === 'home' ? '#4776E6' : '#888'} />
              </Animated.View>
              <Animated.Text style={[styles.navText, { opacity: opacityHome }]}>Home</Animated.Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handlePress(scaleCart, opacityCart, '/cart', 'cart')}
            >
              <Animated.View style={{ transform: [{ scale: scaleCart }] }}>
                <Ionicons name="cart" size={28} color={activeTab === 'cart' ? '#4776E6' : '#888'} />
              </Animated.View>
              <Animated.Text style={[styles.navText, { opacity: opacityCart }]}>Cart</Animated.Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handlePress(scaleProfile, opacityProfile, '/profile', 'profile')}
            >
              <Animated.View style={{ transform: [{ scale: scaleProfile }] }}>
                <Ionicons name="person" size={28} color={activeTab === 'profile' ? '#4776E6' : '#888'} />
              </Animated.View>
              <Animated.Text style={[styles.navText, { opacity: opacityProfile }]}>Profile</Animated.Text>
            </TouchableOpacity>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4776E6', 
    height:130,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardSolid: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#4776E6', // Consistent profile card color
  },
  profileInfo: {
    marginLeft: 16, // Add spacing between the image and text
    flex: 1, // Allow text to take up remaining space
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileEmail: {
    fontSize: 16,
    color: 'white',
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Adjust width for better sizing
  },
  productDetails: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    marginLeft: 16, // Add spacing between the image and text
    flex: 1, // Allow text to take up remaining space
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
  actionButton: {
    backgroundColor: '#4776E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute', // Fix the navigation at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5, // Add shadow for better visibility
    zIndex: 10, // Ensure it stays above other content
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Ensure equal spacing for all items
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
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
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#4776E6', // Consistent close button color
    marginTop: 20,
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
  purchaseCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginRight: 10,
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activePurchaseCard: {
    backgroundColor: '#4776E6',
  },
  purchaseText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20, // Add padding to ensure the last item is reachable
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  loadingLogo: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    marginBottom: 20, // Add spacing between the logo and the text
    resizeMode: 'contain', // Ensure the logo maintains its aspect ratio
    borderRadius: 100,
  },
});

export default ProfileScreen;