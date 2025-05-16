import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Animated, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '@/services/addToCart';

import cscLogo from '../assets/images/CS.png';

const AccessScreen = () => {
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
  const [selectedFilter, setSelectedFilter] = useState('All'); // Default filter

  const products = [
    { id: '1', name: 'Shirt 1', description: 'Comfortable cotton shirt.', price: '₱499', category: 'Shirts', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Tote Bag 1', description: 'Eco-friendly tote bag.', price: '₱299', category: 'Tote Bags', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Lanyard 1', description: 'Durable lanyard for keys.', price: '₱99', category: 'Lanyards', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Pin 1', description: 'Stylish enamel pin.', price: '₱49', category: 'Pins', image: 'https://via.placeholder.com/150' },
    { id: '5', name: 'Sticker 1', description: 'High-quality vinyl sticker.', price: '₱20', category: 'Stickers', image: 'https://via.placeholder.com/150' },
    { id: '6', name: 'Shirt 2', description: 'Premium cotton shirt.', price: '₱599', category: 'Shirts', image: 'https://via.placeholder.com/150' },
    { id: '7', name: 'Tote Bag 2', description: 'Stylish tote bag.', price: '₱399', category: 'Tote Bags', image: 'https://via.placeholder.com/150' },
  ];

  const filters = ['All', 'Shirts', 'Tote Bags', 'Lanyards', 'Pins', 'Stickers'];

  const filteredProducts = selectedFilter === 'All' ? products : products.filter((product) => product.category === selectedFilter);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const cartId = 'demo-cart-id';

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      // Convert price to number
      const priceNumber = Number(String(selectedProduct.price).replace(/[^\d.]/g, ''));
      const product = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: priceNumber,
        quantity: 1,
      };
      await addToCart(cartId, product, 1);
      setModalVisible(false);
      alert(`${selectedProduct.name} has been added to your cart.`);
    } catch (error) {
      alert('Failed to add to cart: ' + (error?.message || error));
      console.error(error);
    }
  };

  const handleBuyNow = () => {
    setModalVisible(false);
    alert(`You have purchased ${selectedProduct.name}.`);
  };

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={cscLogo} style={styles.logo} />
          <Text style={styles.title}>Access</Text>
        </View>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display 2 columns
        columnWrapperStyle={styles.row} // Style for rows
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Product Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                {selectedProduct && (
                  <>
                    <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                    <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
                        <Text style={styles.modalButtonText}>Add to Cart</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton} onPress={handleBuyNow}>
                        <Text style={styles.modalButtonText}>Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.modalCancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 15, 
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#4776E6',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '48%', // Adjust for 2-column layout
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4776E6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4776E6',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    backgroundColor: '#FF3B30',
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

export default AccessScreen;