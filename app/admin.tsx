import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase.config';

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  cost: number;
}

const AdminDashboard = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCost, setProductCost] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        Alert.alert('Access Denied', 'You do not have permission to access this page.');
        router.replace('/');
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      Alert.alert('Error', 'Failed to verify admin status.');
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        }
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleAddProduct = () => {
    if (!productName || !productStock || !productPrice || !productCost) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      stock: parseInt(productStock),
      price: parseFloat(productPrice),
      cost: parseFloat(productCost),
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    setProductName('');
    setProductStock('');
    setProductPrice('');
    setProductCost('');
    setModalVisible(false);
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.id !== productId)
            );
          },
        },
      ]
    );
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct?.name || !selectedProduct?.stock || !selectedProduct?.price) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id ? selectedProduct : product
      )
    );
    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  const handleEditName = (name: string) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        name,
      });
    }
  };

  const handleEditStock = (stock: number) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        stock,
      });
    }
  };

  const handleEditPrice = (price: number) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        price,
      });
    }
  };

  const handleEditCost = (cost: number) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        cost,
      });
    }
  };

  const totalRevenue = products.reduce(
    (acc, product) => acc + product.price * (10 - product.stock),
    0
  );

  const totalCost = products.reduce(
    (acc, product) => acc + product.cost * (10 - product.stock),
    0
  );

  const totalProfit = totalRevenue - totalCost;

  const screenWidth = Dimensions.get('window').width;

  const generateSalesData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const sales = labels.map(() => {
      return products.reduce(
        (acc, product) => acc + product.price * (10 - product.stock),
        0
      );
    });
    return {
      labels,
      datasets: [
        {
          data: sales,
          strokeWidth: 2,
        },
      ],
    };
  };

  const salesData = generateSalesData();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images/IT.png')}
          style={styles.profileBackground}
        />
        <View style={styles.profileContent}>
          <Image
            source={require('../assets/images/IT.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.profileTitle}>Circuits</Text>
            <Text style={styles.profileSubtitle}>
              Bachelor of Science in Information Technology
            </Text>
          </View>
        </View>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.dashboardCards}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Products</Text>
          <Text style={styles.cardValue}>{products.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Text style={styles.cardValue}>₱{totalRevenue.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Cost</Text>
          <Text style={styles.cardValue}>₱{totalCost.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Profit</Text>
          <Text style={styles.cardValue}>₱{totalProfit.toFixed(2)}</Text>
        </View>
      </View>

      {/* Sales Summary Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Sales Summary</Text>
        <LineChart
          data={salesData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#e3f2fd',
            backgroundGradientFrom: '#e3f2fd',
            backgroundGradientTo: '#bbdefb',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#1e88e5',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Inventory Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>No products yet.</Text>
          ) : (
            products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDetails}>Stock: {product.stock}</Text>
                  <Text style={styles.productDetails}>Price: ₱{product.price}</Text>
                  <Text style={styles.productDetails}>Cost: ₱{product.cost}</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity onPress={() => handleEditProduct(product)}>
                    <Ionicons name="create" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.addProductButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Adding Product */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              placeholder="Stock"
              keyboardType="numeric"
              style={styles.input}
              value={productStock}
              onChangeText={setProductStock}
            />
            <TextInput
              placeholder="Price"
              keyboardType="decimal-pad"
              style={styles.input}
              value={productPrice}
              onChangeText={setProductPrice}
            />
            <TextInput
              placeholder="Cost"
              keyboardType="decimal-pad"
              style={styles.input}
              value={productCost}
              onChangeText={setProductCost}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Editing Product */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={selectedProduct?.name}
              onChangeText={handleEditName}
            />
            <TextInput
              placeholder="Stock"
              keyboardType="numeric"
              style={styles.input}
              value={selectedProduct?.stock.toString()}
              onChangeText={(text) => handleEditStock(parseInt(text))}
            />
            <TextInput
              placeholder="Price"
              keyboardType="decimal-pad"
              style={styles.input}
              value={selectedProduct?.price.toString()}
              onChangeText={(text) => handleEditPrice(parseFloat(text))}
            />
            <TextInput
              placeholder="Cost"
              keyboardType="decimal-pad"
              style={styles.input}
              value={selectedProduct?.cost.toString()}
              onChangeText={(text) => handleEditCost(parseFloat(text))}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleSaveEdit}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#4776E6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 3,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  profileBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#1e88e5',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  profileTagline: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  profileDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  dashboardCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: -1,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productInfo: {
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  productDetails: {
    color: '#555',
    fontSize: 14,
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4776E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addProductButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});

export default AdminDashboard; 