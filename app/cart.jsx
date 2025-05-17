import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { getAllCarts, removeFromCart, clearCart, addToCart } from '@/services/addToCart';
import { createTransaction, updateProductStock } from '@/services/transactionService';

const CartScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    const fetchCarts = async () => {
      try {
        const carts = await getAllCarts();
        if (isMounted) {
          if (carts.length > 0) {
            setItems(
              carts[0].items.map(item => ({
                id: item.product?.id || item.id,
                name: item.product?.name || item.title,
                description: item.product?.description || '',
                price: item.product?.price || item.price,
                imageUrl: item.product?.imageUrl || item.image,
                quantity: item.quantity,
                college: item.product?.college || '',
                category: item.product?.category || ''
              }))
            );
          } else {
            setItems([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch carts:', error);
          Alert.alert('Error', 'Failed to load cart items');
        }
      }
    };
    fetchCarts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Create transaction
      const transactionId = await createTransaction(items, totalPrice);
      
      // Update stock for each item
      for (const item of items) {
        await updateProductStock(item.college, item.category, item.id, item.quantity);
      }
      
      // Clear cart after successful transaction
      await clearCart('demo-cart-id');
      setItems([]);
      
      Alert.alert(
        'Success',
        'Your order has been placed successfully!',
        [
          {
            text: 'View Orders',
            onPress: () => router.push('/profile')
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.push('/dashboard')
          }
        ]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', error.message || 'Failed to process checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrease = async (id) => {
    try {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setItems(updatedItems);
      // Update cart in Firestore
      const item = items.find(item => item.id === id);
      if (item) {
        await addToCart('demo-cart-id', item, 1);
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleDecrease = async (id) => {
    try {
      const item = items.find(item => item.id === id);
      if (item && item.quantity > 1) {
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
        setItems(updatedItems);
        // Update cart in Firestore
        await removeFromCart('demo-cart-id', id);
        await addToCart('demo-cart-id', item, -1);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart('demo-cart-id', id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
        <Text style={styles.itemCollege}>{item.college}</Text>
        <View style={styles.quantityContainer}></View>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  // Animation references for bottom navigation
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  const opacityHome = useRef(new Animated.Value(1)).current;
  const opacityCart = useRef(new Animated.Value(1)).current;
  const opacityProfile = useRef(new Animated.Value(1)).current;

  const [activeTab, setActiveTab] = useState('cart');

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
      </View>

      {/* Cart Items */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.cartContainer}
        />
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/200x150" }}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCartText}>Your cart is empty!</Text>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.shopNowButton}>
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Total and Checkout */}
      {items.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₱{totalPrice.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.checkoutButton, { opacity: isLoading ? 0.5 : 1 }]}
            disabled={isLoading}
            onPress={handleCheckout}
          >
            <View style={styles.checkoutSolid}>
              <Text style={styles.checkoutText}>
                {isLoading ? 'Processing...' : 'Checkout'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

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
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#4776E6', // Solid color for header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    height:130,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    marginTop:35,
  },
  cartContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12, // Increased padding for better spacing
    marginBottom: 12, // Added consistent spacing between items
    elevation: 2,
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12, // Increased spacing between image and details
  },
  itemTitle: {
    fontSize: 16, // Adjusted font size for consistency
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Added spacing below the title
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6, // Added spacing below the description
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4776E6', // Updated to use the solid color
    marginBottom: 8, // Added spacing below the price
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // Added spacing above the quantity controls
  },
  quantityText: {
    marginHorizontal: 12, // Increased spacing between quantity controls
    fontSize: 16,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  checkoutButton: {
    alignItems: 'center',
  },
  checkoutSolid: {
    backgroundColor: '#4776E6', // Solid color for checkout button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkoutText: {
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
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 16, // Added padding for better alignment
  },
  emptyCartImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center', // Centered text for better alignment
  },
  shopNowButton: {
    backgroundColor: '#4776E6', // Solid color instead of gradient
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30', // Red color for remove button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemCollege: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    marginTop: 35,
  },
});

export default CartScreen;