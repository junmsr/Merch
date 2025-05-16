import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Animated, Modal, Button, TouchableWithoutFeedback, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '@/services/addToCart';
import { fetchProducts, fetchCategoriesForCollege } from '../services/productService';
import Logo from '../assets/images/Vintage.png';

// Import college logos
import IT from '../assets/images/IT.png';
import CHEM from '../assets/images/CHEM.png';
import BIO from '../assets/images/BIO.png';
import CS from '../assets/images/CS.png';
import STORM from '../assets/images/STORM.png';
import Profile from '../assets/images/profile.png'; // Import the Junmar.png image

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Circuits', image: IT },
  { name: 'Chess', image: CHEM },
  { name: 'Symbiosis', image: BIO },
  { name: 'Access', image: CS },
  { name: 'STORM', image: STORM },
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

  // Animation references for glitch effect
  const glitchTranslateX = useRef(new Animated.Value(0)).current;
  const glitchTranslateY = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const glitchAnimation = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glitchTranslateX, {
            toValue: Math.random() * 10 - 5, // Random horizontal offset
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glitchTranslateY, {
            toValue: Math.random() * 10 - 5, // Random vertical offset
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOpacity, {
            toValue: 0.5, // Reduce opacity during glitch
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glitchTranslateX, {
            toValue: 0, // Reset horizontal offset
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(glitchTranslateY, {
            toValue: 0, // Reset vertical offset
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOpacity, {
            toValue: 1, // Reset opacity
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => glitchAnimation()); // Loop the animation
    };

    glitchAnimation();
  }, [glitchTranslateX, glitchTranslateY, glitchOpacity]);

  // Animation references for each tab
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  const opacityHome = useRef(new Animated.Value(1)).current;
  const opacityCart = useRef(new Animated.Value(0.5)).current;
  const opacityProfile = useRef(new Animated.Value(0.5)).current;

  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    const loadAllProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = {};
        const colleges = ['circuits', 'chess', 'symbiosis', 'access', 'storm'];
        
        for (const college of colleges) {
          const categories = await fetchCategoriesForCollege(college);
          const collegeProducts = {};
          
          for (const category of categories) {
            const categoryProducts = await fetchProducts(college, category);
            // Attach category to each product
            collegeProducts[category] = categoryProducts.filter(p => p.stock > 0).map(product => ({ ...product, category }));
          }
          
          allProducts[college] = collegeProducts;
        }
        
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  const handleViewAll = async (category) => {
    setSelectedCategory(category);
    setIsCategoryLoading(true);
    setCategoryModalVisible(true);
    
    try {
      const colleges = ['circuits', 'chess', 'symbiosis', 'access', 'storm'];
      const allCategoryProducts = [];
      
      for (const college of colleges) {
        const categoryProducts = await fetchProducts(college, category.toLowerCase());
        // Attach category to each product
        const productsWithCollege = categoryProducts.filter(p => p.stock > 0).map(product => ({
          ...product,
          college: college.charAt(0).toUpperCase() + college.slice(1),
          category: category.toLowerCase()
        }));
        allCategoryProducts.push(...productsWithCollege);
      }
      
      setCategoryProducts(allCategoryProducts);
    } catch (error) {
      console.error('Error loading category products:', error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalVisible(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      const priceNumber = Number(String(selectedProduct.price).replace(/[^\d.]/g, ''));
      const product = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: priceNumber,
        quantity: modalQuantity,
        college: selectedProduct.college.toLowerCase(),
        category: selectedProduct.category.toLowerCase(),
        description: selectedProduct.description,
        imageUrl: selectedProduct.imageUrl
      };
      await addToCart('demo-cart-id', product, modalQuantity);
      setModalVisible(false);
      alert(`${selectedProduct.name} has been added to your cart.`);
    } catch (error) {
      alert('Failed to add to cart: ' + (error?.message || error));
      console.error(error);
    }
  };

  const handleBuyNow = () => {
    setModalVisible(false);
    router.push('/checkout');
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

    setActiveTab(tabName);
    if (route) router.push(route);
  };

  const getFeaturedProducts = (category) => {
    const featuredProducts = [];
    Object.entries(products).forEach(([college, categories]) => {
      if (categories[category.toLowerCase()]) {
        featuredProducts.push(...categories[category.toLowerCase()].slice(0, 3).map(product => ({
          ...product,
          college: college.charAt(0).toUpperCase() + college.slice(1)
        })));
      }
    });
    return featuredProducts.slice(0, 3);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={Logo} style={styles.logo} />
          <Animated.Text
            style={[
              styles.title,
              {
                transform: [
                  { translateX: glitchTranslateX },
                  { translateY: glitchTranslateY },
                ],
                opacity: glitchOpacity,
              },
            ]}
          >
            CShop
          </Animated.Text>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4776E6" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          ['shirts', 'tote bags', 'lanyards', 'pins', 'stickers'].map((category, idx) => {
            const featuredProducts = getFeaturedProducts(category);
            if (featuredProducts.length === 0) return null;

            return (
              <View key={idx} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  <TouchableOpacity onPress={() => handleViewAll(category)}>
                    <View style={styles.viewAllButton}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {featuredProducts.map((item, i) => (
                    <TouchableOpacity key={i} style={styles.card} onPress={() => handleProductPress(item)}>
                      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.cardImage} />
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardDescription}>{item.description}</Text>
                      <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
                      <Text style={styles.collegeTag}>{item.college}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Product Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                {selectedProduct && (
                  <>
                    <Image source={{ uri: selectedProduct.imageUrl || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                    <Text style={styles.modalPrice}>₱{selectedProduct.price.toFixed(2)}</Text>
                    <Text style={styles.modalCollege}>{selectedProduct.college}</Text>
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

      {/* Category View Modal */}
      <Modal visible={categoryModalVisible} transparent animationType="slide" onRequestClose={() => setCategoryModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.categoryModalContent}>
            <View style={styles.categoryModalHeader}>
              <Text style={styles.categoryModalTitle}>
                {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : ''}
              </Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {isCategoryLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4776E6" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : categoryProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#888" />
                <Text style={styles.emptyText}>No products available in this category yet.</Text>
              </View>
            ) : (
              <FlatList
                data={categoryProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.categoryProductCard} onPress={() => handleProductPress(item)}>
                    <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.categoryProductImage} />
                    <View style={styles.categoryProductInfo}>
                      <Text style={styles.categoryProductName}>{item.name}</Text>
                      <Text style={styles.categoryProductDescription}>{item.description}</Text>
                      <Text style={styles.categoryProductPrice}>₱{item.price.toFixed(2)}</Text>
                      <Text style={styles.categoryProductCollege}>{item.college}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.categoryProductList}
              />
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
    paddingVertical: 20,
  },
  category: {
    marginBottom: 30,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay for focus
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20, // Rounded corners
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Shadow for Android
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover', // Ensures the image covers the container seamlessly
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4776E6',
    marginBottom: 10,
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
  collegeTag: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  categoryModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryProductList: {
    paddingBottom: 20,
  },
  categoryProductCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  categoryProductImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  categoryProductInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  categoryProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryProductDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  categoryProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4776E6',
    marginBottom: 4,
  },
  categoryProductCollege: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalCollege: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default DashboardScreen;