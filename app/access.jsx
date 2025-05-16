import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Animated, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '@/services/addToCart';
import { fetchProducts, fetchCategoriesForCollege } from '../services/productService';

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
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(['All']);
  const cartId = 'demo-cart-id';
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      try {
        // Fetch categories for the college
        const categories = await fetchCategoriesForCollege('access');
        setFilters(['All', ...categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))]);
        
        // Fetch products for the selected category
        if (selectedFilter !== 'All') {
          const categoryId = selectedFilter.toLowerCase();
          const fetchedProducts = await fetchProducts('access', categoryId);
          // Attach category to each product
          setProducts(fetchedProducts.filter(p => p.stock > 0).map(product => ({ ...product, category: categoryId })));
        } else {
          // If 'All' is selected, fetch products from all categories
          const allProducts = [];
          for (const category of categories) {
            const categoryProducts = await fetchProducts('access', category);
            // Attach category to each product
            allProducts.push(...categoryProducts.filter(p => p.stock > 0).map(product => ({ ...product, category })));
          }
          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoriesAndProducts();
  }, [selectedFilter]);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalVisible(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    const categoryValue = selectedFilter === 'All'
      ? (selectedProduct.category ? selectedProduct.category.toLowerCase() : null)
      : selectedFilter.toLowerCase();
    if (!categoryValue) {
      alert('Product category is missing. Please try another product.');
      return;
    }
    try {
      const priceNumber = Number(String(selectedProduct.price).replace(/[^\d.]/g, ''));
      const product = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: priceNumber,
        quantity: modalQuantity,
        college: 'access',
        category: categoryValue,
        description: selectedProduct.description,
        imageUrl: selectedProduct.imageUrl
      };
      await addToCart(cartId, product, modalQuantity);
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4776E6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>No products available in this category yet.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
              <Image 
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.productImage} 
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              <Text style={styles.productPrice}>₱{item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

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
                    {/* Quantity Selector */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                      <TouchableOpacity
                        onPress={() => setModalQuantity(q => Math.max(1, q - 1))}
                        style={{ padding: 8, backgroundColor: '#eee', borderRadius: 5, marginRight: 10 }}
                      >
                        <Ionicons name="remove" size={20} color="#4776E6" />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 }}>{modalQuantity}</Text>
                      <TouchableOpacity
                        onPress={() => setModalQuantity(q => Math.min(q + 1, selectedProduct.stock || 1))}
                        style={{ padding: 8, backgroundColor: '#eee', borderRadius: 5, marginLeft: 10 }}
                        disabled={modalQuantity >= (selectedProduct.stock || 1)}
                      >
                        <Ionicons name="add" size={20} color="#4776E6" />
                      </TouchableOpacity>
                      <Text style={{ marginLeft: 10, color: '#666' }}>Stock: {selectedProduct.stock || 1}</Text>
                    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AccessScreen;