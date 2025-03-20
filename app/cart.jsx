import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const cartItems = [
  {
    id: 1,
    title: "CSC Shirt",
    description: "Premium cotton fabric",
    price: 499,
    image: "https://via.placeholder.com/120x80",
    quantity: 1,
  },
  {
    id: 2,
    title: "Tech Shirt",
    description: "Comfort fit with logo",
    price: 599,
    image: "https://via.placeholder.com/120x80",
    quantity: 1,
  },
];

const CartScreen = () => {
  const router = useRouter();
  const [items, setItems] = useState(cartItems);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

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

  const handleIncrease = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrease = (id) => {
    setItems(items.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const renderCartItems = () => {
    if (items.length === 0) {
      return (
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
      );
    }

    return items.map(item => (
      <Animated.View key={item.id} style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.cartImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>₱{item.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrease(item.id)}>
              <Ionicons name="remove-circle" size={24} color="#8E54E9" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrease(item.id)}>
              <Ionicons name="add-circle" size={24} color="#8E54E9" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </LinearGradient>

      {/* Cart Items */}
      <ScrollView contentContainerStyle={styles.cartContainer}>
        {renderCartItems()}
        {/* Add padding to the bottom of the scroll view */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Total and Checkout */}
      {items.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₱{totalPrice}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <LinearGradient colors={['#8E54E9', '#4776E6']} style={styles.checkoutGradient}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </LinearGradient>
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
    padding: 16,
    backgroundColor: '#8E54E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  cartContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E54E9',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    position: 'absolute',
    bottom: 60, // Adjusted to be above the bottom navigation
    left: 0,
    right: 0,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  checkoutButton: {
    alignItems: 'center',
  },
  checkoutGradient: {
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
    bottom: 0,
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
  },
  shopNowButton: {
    backgroundColor: '#8E54E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;