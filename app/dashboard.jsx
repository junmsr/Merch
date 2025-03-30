import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Animated, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import cscLogo from '../assets/images/logo.png';
import IT from '../assets/images/IT.png';
import CHEM from '../assets/images/CHEM.png';
import LOGO from '../assets/images/logo.png';
import BIO from '../assets/images/BIO.png';
import CS from '../assets/images/CS.png';
import STORM from '../assets/images/STORM.png';
import Junmar from '../assets/images/Junmar.png'; // Import the Junmar.png image

const { width } = Dimensions.get('window');

const categories = [
  { name: "Circuits", image: IT},
  { name: "Chess", image: CHEM },
  { name: "CSC", image: LOGO },
  { name: "Symbiosis", image: BIO },
  { name: "Access", image: CS },
  { name: "STORM", image: STORM },
];

const sections = [
  {
    title: "Shirt",
    items: [
      { title: "CSC Shirt", description: "Premium cotton fabric", price: "₱499", image: "https://via.placeholder.com/120x80" },
      { title: "Tech Shirt", description: "Comfort fit with logo", price: "₱599", image: "https://via.placeholder.com/120x80" },
      { title: "Black Shirt", description: "Minimalist style", price: "₱450", image: "https://via.placeholder.com/120x80" },
    ],
  },
  {
    title: "Tote Bag",
    items: [
      { title: "Eco Tote", description: "100% organic cotton", price: "₱350", image: "https://via.placeholder.com/120x80" },
      { title: "Canvas Tote", description: "Durable & spacious", price: "₱399", image: "https://via.placeholder.com/120x80" },
      { title: "Graphic Tote", description: "Stylish & functional", price: "₱450", image: "https://via.placeholder.com/120x80" },
    ],
  },
  {
    title: "Lanyard",
    items: [
      { title: "ID Lanyard", description: "Strong clip & strap", price: "₱150", image: "https://via.placeholder.com/120x80" },
      { title: "Printed Lanyard", description: "Vibrant colors", price: "₱199", image: "https://via.placeholder.com/120x80" },
      { title: "Customized Lanyard", description: "Personalized design", price: "₱250", image: "https://via.placeholder.com/120x80" },
    ],
  },
];

const DashboardScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Animation references for each tab
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  const opacityHome = useRef(new Animated.Value(1)).current;
  const opacityCart = useRef(new Animated.Value(0.5)).current;
  const opacityProfile = useRef(new Animated.Value(0.5)).current;

  const [activeTab, setActiveTab] = useState('home');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePress = (scaleRef, opacityRef, route, tabName) => {
    // Reset all opacities
    Animated.timing(opacityHome, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacityCart, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacityProfile, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();

    // Animate the selected tab
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

    // Set the active tab
    setActiveTab(tabName);

    // Navigate to the route after animation
    if (route) router.push(route);
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    setModalVisible(false);
    console.log(`${selectedProduct.title} added to cart`);
  };

  const handleBuyNow = () => {
    setModalVisible(false);
    console.log(`Proceeding to buy ${selectedProduct.title}`);
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={cscLogo} style={styles.logo} />
          <Text style={styles.title}>E-Merch</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput placeholder="Search products..." style={styles.searchInput} />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
  {categories.map((category, index) => (
    <TouchableOpacity
      key={index}
      style={styles.category}
      activeOpacity={0.8}
      onPress={() => {
        switch (category.name) {
          case 'Circuits':
            router.push('/circuits');
            break;
          case 'Chess':
            router.push('/chess');
            break;
          case 'CSC':
            router.push('/csc');
            break;
          case 'Symbiosis':
            router.push('/symbiosis');
            break;
          case 'Access':
            router.push('/access');
            break;
          case 'STORM':
            router.push('/storm');
            break;
          default:
            break;
        }
      }}
    >
      <View style={styles.categoryBox}>
        <Image source={category.image} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      {/* Sections */}
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity>
                <View style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={i} style={styles.card} onPress={() => handleProductPress(item)}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                {/* Product Image */}
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                </View>

                {/* Product Details */}
                <View style={styles.modalDetailsContainer}>
                  <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
                </View>

                {/* Divider */}
                <View style={styles.modalDivider} />

                {/* Customer Reviews Section */}
                <Text style={styles.reviewTitle}>Customer Reviews</Text>
                <ScrollView style={styles.reviewContainer}>
                  <View style={styles.reviewItem}>
                    <Image source={Junmar} style={styles.reviewProfile} />
                    <View style={styles.reviewContent}>
                      <Text style={styles.reviewText}>"Great quality! Highly recommend."</Text>
                      <Text style={styles.reviewAuthor}>- John Doe</Text>
                    </View>
                  </View>
                  <View style={styles.reviewItem}>
                    <Image source={Junmar} style={styles.reviewProfile} />
                    <View style={styles.reviewContent}>
                      <Text style={styles.reviewText}>"The fabric is so soft and comfortable."</Text>
                      <Text style={styles.reviewAuthor}>- Jane Smith</Text>
                    </View>
                  </View>
                  <View style={styles.reviewItem}>
                    <Image source={Junmar} style={styles.reviewProfile} />
                    <View style={styles.reviewContent}>
                      <Text style={styles.reviewText}>"Worth every penny. Will buy again!"</Text>
                      <Text style={styles.reviewAuthor}>- Alex Johnson</Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
                    <Text style={styles.modalButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleBuyNow}>
                    <Text style={styles.modalButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
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
    backgroundColor: '#4776E6',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 47,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoryContainer: {
    paddingVertical: 25,
  },
  category: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 15,
    marginTop: -15,
  },
  categoryBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#4776E6',
  },
  viewAllText: {
    fontSize: 14,
    color: '#fff',
  },
  card: {
    width: width * 0.4,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4776E6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay for focus
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20, // Rounded corners
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Shadow for Android
  },
  modalImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  modalDetailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4776E6',
    marginBottom: 10,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  reviewContainer: {
    maxHeight: 150, // Limit the height of the review section
    width: '100%',
    marginBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row', // Align profile image and text horizontally
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  reviewProfile: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular profile image
    marginRight: 10,
  },
  reviewContent: {
    flex: 1, // Allow the text to take up remaining space
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left', // Align text to the left
  },
  reviewAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Align text to the left
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#4776E6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 15,
    backgroundColor: '#FF3B30', // Red for cancel
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#333',
  },
});

export default DashboardScreen;