import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import cscLogo from '../assets/images/logo.png';
import IT from '../assets/images/IT.png';
import CHEM from '../assets/images/CHEM.png';
import LOGO from '../assets/images/logo.png';
import BIO from '../assets/images/BIO.png';
import CS from '../assets/images/CS.png';
import STORM from '../assets/images/STORM.png';

const { width } = Dimensions.get('window');

const categories = [
  { name: "Circuits", image: IT },
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

const App = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E54E9','#4776E6']} style={styles.header}>
        <Image source={cscLogo} style={styles.logo} />
        <Text style={styles.title}>E-Merch</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={26} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.category}>
            <Image source={category.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={i} style={styles.card}>
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
           {/* Bottom Navigation */}
           <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart" size={28} color="#333" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={28} color="#333" />
          <Text style={styles.navText}>Profile</Text>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  category: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  viewAll: {
    fontSize: 14,
    color: '#ff6b6b',
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
  },
});

export default App;