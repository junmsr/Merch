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
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addProduct, updateProduct, deleteProduct, fetchProducts, fetchAllColleges, fetchCategoriesForCollege } from '../services/productService';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const adminAssignedCollege = route.params?.college;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCost, setProductCost] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState(adminAssignedCollege || 'circuits');
  const [viewingCategoryId, setViewingCategoryId] = useState('shirts');

  const [collegeOptions, setCollegeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      try {
        console.log('Loading options with adminAssignedCollege:', adminAssignedCollege);
        if (adminAssignedCollege) {
          console.log('Setting college options for admin assigned college');
          setCollegeOptions([adminAssignedCollege]);
          setSelectedCollegeId(adminAssignedCollege);
          const categories = await fetchCategoriesForCollege(adminAssignedCollege);
          console.log('Fetched categories for admin college:', categories);
          setCategoryOptions(categories);
          if (categories.length > 0 && !categories.includes(viewingCategoryId)) {
            setViewingCategoryId(categories[0]);
          } else if (categories.length === 0) {
            setViewingCategoryId('');
          }
        } else {
          console.log('Fetching all colleges');
          const colleges = await fetchAllColleges();
          console.log('Fetched colleges:', colleges);
          setCollegeOptions(colleges);
          if (!selectedCollegeId && colleges.length > 0) {
             setSelectedCollegeId(colleges[0]);
             const categories = await fetchCategoriesForCollege(colleges[0]);
             console.log('Fetched categories for first college:', categories);
             setCategoryOptions(categories);
             if (categories.length > 0) setViewingCategoryId(categories[0]); else setViewingCategoryId('');
          } else if (selectedCollegeId) {
            const categories = await fetchCategoriesForCollege(selectedCollegeId);
            console.log('Fetched categories for selected college:', categories);
            setCategoryOptions(categories);
            if (categories.length > 0 && !categories.includes(viewingCategoryId)) {
                 setViewingCategoryId(categories[0]);
            } else if (categories.length === 0 && viewingCategoryId !== '') {
                 setViewingCategoryId('');
            }
          }
        }
      } catch (error) {
        console.error('Error loading options:', error);
        Alert.alert('Error', 'Failed to load college/category options. ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [adminAssignedCollege]);

  useLayoutEffect(() => {
    const loadCategoryOptions = async () => {
      if (selectedCollegeId) {
        setIsLoading(true);
        try {
          const categories = await fetchCategoriesForCollege(selectedCollegeId);
          setCategoryOptions(categories);
          if (categories.length > 0 && !categories.includes(viewingCategoryId)) {
            setViewingCategoryId(categories[0]);
          } else if (categories.length === 0) {
            setViewingCategoryId('');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to load category options for college. ' + error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (!adminAssignedCollege && selectedCollegeId) {
        loadCategoryOptions();
    } else if (adminAssignedCollege && selectedCollegeId === adminAssignedCollege && categoryOptions.length === 0) {
        loadCategoryOptions();
    }
  }, [selectedCollegeId, adminAssignedCollege, categoryOptions.length]);

  const _fetchProducts = async (collegeId, categoryId) => {
    if (!collegeId || !categoryId) {
      setProducts([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetchedProducts = await fetchProducts(collegeId, categoryId);
      setProducts(fetchedProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products. ' + error.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    _fetchProducts(selectedCollegeId, viewingCategoryId);
  }, [selectedCollegeId, viewingCategoryId]);

  const handleAddProduct = async () => {
    if (!productName || !productStock || !productPrice || !productCost || !productCategory) {
      Alert.alert('Missing Required Fields', 'Please fill in Name, Stock, Price, Cost, and Category.');
      return;
    }

    const newProductData = {
      name: productName,
      stock: parseInt(productStock, 10),
      price: parseFloat(productPrice),
      cost: parseFloat(productCost),
      description: productDescription,
      imageUrl: productImageUrl,
    };

    setIsLoading(true);
    try {
      await addProduct(selectedCollegeId, productCategory, newProductData);
      Alert.alert('Success', 'Product added successfully!');
      setProductName('');
      setProductStock('');
      setProductPrice('');
      setProductCost('');
      setProductDescription('');
      setProductImageUrl('');
      setProductCategory('');
      setModalVisible(false);
      if (productCategory === viewingCategoryId) {
        _fetchProducts(selectedCollegeId, viewingCategoryId);
      } else {
        Alert.alert('Info', `Product added to category: ${productCategory}. Change viewing category to see it.`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productToDelete) => {
    if (!productToDelete || !productToDelete.id) {
      Alert.alert('Error', 'Product information is missing.');
      return;
    }

    const { id: productId, category } = productToDelete;
    const actualCategory = category || viewingCategoryId;

    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productToDelete.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteProduct(selectedCollegeId, actualCategory, productId);
              Alert.alert('Success', 'Product deleted successfully!');
              _fetchProducts(selectedCollegeId, viewingCategoryId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product. ' + error.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.name || '');
    setProductPrice(product.price !== undefined ? String(product.price) : '');
    setProductStock(product.stock !== undefined ? String(product.stock) : '');
    setProductCost(product.cost !== undefined ? String(product.cost) : '');
    setProductDescription(product.description || '');
    setProductImageUrl(product.imageUrl || '');
    setProductCategory(product.category || viewingCategoryId);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct || !selectedProduct.id) {
      Alert.alert('Error', 'No product selected for editing.');
      return;
    }

    if (!productName || productStock === '' || productPrice === '' || productCost === '') {
      Alert.alert('Missing Fields', 'Please fill in all required fields (Name, Stock, Price, Cost).');
      return;
    }

    const updatedProductData = {
      name: productName,
      stock: parseInt(productStock, 10),
      price: parseFloat(productPrice),
      cost: parseFloat(productCost),
      description: productDescription,
      imageUrl: productImageUrl,
    };

    const originalProductCategory = selectedProduct.category || viewingCategoryId;

    setIsLoading(true);
    try {
      await updateProduct(selectedCollegeId, originalProductCategory, selectedProduct.id, updatedProductData);
      Alert.alert('Success', 'Product updated successfully!');
      setEditModalVisible(false);
      setSelectedProduct(null);
      _fetchProducts(selectedCollegeId, viewingCategoryId);
    } catch (error) {
      Alert.alert('Error', 'Failed to update product. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('login') },
    ]);
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
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','July','Aug','Sept','Oct','Nov','Dec'];
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

  // Add console log for picker changes
  const handleCollegeChange = (itemValue) => {
    console.log('College picker changed to:', itemValue);
    if (!adminAssignedCollege) {
      setSelectedCollegeId(itemValue);
    }
  };

  const handleCategoryChange = (itemValue) => {
    console.log('Category picker changed to:', itemValue);
    setViewingCategoryId(itemValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>College Context:</Text>
              <Picker
              selectedValue={selectedCollegeId}
              onValueChange={handleCollegeChange}
              style={styles.picker}
              enabled={!adminAssignedCollege && collegeOptions.length > 0}
              >
              {collegeOptions.map(college => (
                  <Picker.Item key={college} label={college.charAt(0).toUpperCase() + college.slice(1)} value={college} />
              ))}
              </Picker>
          </View>
          <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Viewing Category:</Text>
              <Picker
              selectedValue={viewingCategoryId}
              onValueChange={handleCategoryChange}
              style={styles.picker}
              enabled={categoryOptions.length > 0}
              >
              {categoryOptions.map(category => (
                  <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1)} value={category} />
              ))}
              </Picker>
          </View>
        </View>

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
              <Text style={styles.profileTitle}>{selectedCollegeId ? selectedCollegeId.charAt(0).toUpperCase() + selectedCollegeId.slice(1) : 'Admin'} Dashboard</Text>
              <Text style={styles.profileSubtitle}>
                Managing products for {selectedCollegeId ? selectedCollegeId.charAt(0).toUpperCase() + selectedCollegeId.slice(1) : 'selected college'}
              </Text>
            </View>
          </View>
        </View>

      
        <View style={styles.dashboardCards}>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Products</Text>
              <Text style={styles.cardValue}>{products.length}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Revenue</Text>
              <Text style={styles.cardValue}>₱{totalRevenue.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Cost</Text>
              <Text style={styles.cardValue}>₱{totalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Profit</Text>
              <Text style={styles.cardValue}>₱{totalProfit.toFixed(2)}</Text>
            </View>
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>No products yet.</Text>
          ) : (
            products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                <Text style={styles.productDetails}>Category: {product.category || viewingCategoryId}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDetails}>Stock: {product.stock !== undefined ? product.stock : 'N/A'}</Text>
                  <Text style={styles.productDetails}>Price: ₱{product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text>
                  <Text style={styles.productDetails}>Cost: ₱{product.cost !== undefined ? product.cost.toFixed(2) : 'N/A'}</Text>
                  {product.description && <Text style={styles.productDetails}>Desc: {product.description}</Text>}
                  {product.imageUrl && <Image source={{ uri: product.imageUrl }} style={styles.productImageMini} />}
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity onPress={() => handleEditProduct(product)}>
                    <Ionicons name="create" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(product)}>
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <Picker
              selectedValue={productCategory}
              onValueChange={(itemValue) => setProductCategory(itemValue)}
              style={styles.input}
              enabled={categoryOptions.length > 0}
            >
              <Picker.Item label="Select Category for New Product" value="" />
              {categoryOptions.map(cat => (
                <Picker.Item key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={cat} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock Quantity"
              value={productStock}
              onChangeText={setProductStock}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₱)"
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cost of Goods (₱)"
              value={productCost}
              onChangeText={setProductCost}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Product Description (Optional)"
              value={productDescription}
              onChangeText={setProductDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Product Image URL (Optional)"
              value={productImageUrl}
              onChangeText={setProductImageUrl}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setEditModalVisible(false);
          setSelectedProduct(null);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            <Text style={styles.inputLabel}>Category: {productCategory}</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock Quantity"
              value={productStock}
              onChangeText={setProductStock}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₱)"
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cost of Goods (₱)"
              value={productCost}
              onChangeText={setProductCost}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Product Description (Optional)"
              value={productDescription}
              onChangeText={setProductDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Product Image URL (Optional)"
              value={productImageUrl}
              onChangeText={setProductImageUrl}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setEditModalVisible(false);
                setSelectedProduct(null);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminDashboard;

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
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#4776E6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#ccc',
  },
  productImageMini: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginTop: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    marginLeft: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  picker: {
    height: 40,
  }
});
