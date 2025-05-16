import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@/services/firebase.config';
import { getUserProfile, getUserTransactions, updateTransactionStatus } from '@/services/transactionService';

import ProfileImage from '../assets/images/profile.png';
import SampleProductImage from '../assets/images/profile.png'; // Replace with your sample product image path

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
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeSection, setActiveSection] = useState('To Receive');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        const userTransactions = await getUserTransactions();
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
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

  const handleConfirmReceipt = async (transactionId) => {
    try {
      await updateTransactionStatus(transactionId, 'completed');
      // Refresh transactions
      const updatedTransactions = await getUserTransactions();
      setTransactions(updatedTransactions);
      setModalVisible(false);
      Alert.alert('Success', 'Order marked as received');
    } catch (error) {
      console.error('Error confirming receipt:', error);
      Alert.alert('Error', 'Failed to confirm receipt');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const renderTransactionItem = (transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={styles.transactionCard}
      onPress={() => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
      }}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionDate}>
          {new Date(transaction.createdAt?.toDate()).toLocaleDateString()}
        </Text>
        <Text style={[
          styles.transactionStatus,
          { color: transaction.status === 'completed' ? '#4CAF50' : '#FFA000' }
        ]}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Text>
      </View>
      <View style={styles.transactionItems}>
        {transaction.items.map((item, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.quantity}x • ₱{item.price.toFixed(2)} • {item.college}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.transactionTotal}>
        Total: ₱{transaction.totalAmount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedTransaction && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Order Details</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {selectedTransaction.items.map((item, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemDetails}>
                      Quantity: {item.quantity} • ₱{item.price.toFixed(2)} each
                    </Text>
                    <Text style={styles.modalItemCollege}>{item.college}</Text>
                  </View>
                ))}
                <Text style={styles.modalTotal}>
                  Total: ₱{selectedTransaction.totalAmount.toFixed(2)}
                </Text>
                {selectedTransaction.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmReceipt(selectedTransaction.id)}
                  >
                    <Text style={styles.confirmButtonText}>Confirm Receipt</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Use the Vintage.png logo */}
        <Image source={require('../assets/images/Vintage.png')} style={styles.loadingLogo} />
        <Text style={styles.loadingText}>Loading profile...</Text>
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
              <Text style={styles.profileName}>{userProfile?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{userProfile?.email || 'user@email.com'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* My Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {['To Receive'].map((section) => (
              <TouchableOpacity
                key={section}
                style={[
                  styles.purchaseCard,
                  activeSection === section && styles.activePurchaseCard,
                ]}
                onPress={() => setActiveSection(section)}
              >
                <MaterialCommunityIcons
                  name="package-variant"
                  size={32}
                  color={activeSection === section ? '#4776E6' : '#888'}
                />
                <Text style={styles.purchaseText}>{section}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Transactions List */}
          <View style={styles.transactionsList}>
            {transactions
              .filter(t => t.status === 'pending')
              .map(renderTransactionItem)}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Transaction Modal */}
      {renderTransactionModal()}

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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4776E6', 
    height:130,
    marginBottom: 5,
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
    bottom: 5,
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
    marginTop: 20,
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
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionItems: {
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  transactionTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4776E6',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScroll: {
    maxHeight: '80%',
  },
  modalItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalItemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalItemCollege: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4776E6',
    marginTop: 15,
    textAlign: 'right',
  },
  confirmButton: {
    backgroundColor: '#4776E6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsList: {
    marginTop: 20,
  },
});

export default ProfileScreen;