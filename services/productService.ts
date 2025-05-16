import { db } from './firebase.config';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';

interface Product {
  id?: string; // Firestore will generate if not provided on add
  name: string;
  price: number;
  stock?: number;
  cost?: number;
  description?: string;
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  // Add other product fields here
}

// Define a more specific type for product data being added, so Firestore can generate the ID.
type ProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Adds a new product to a specific category within a college.
 * Example path: colleges/collegeName/categories/categoryName/products/productId
 * @param collegeId - The name/ID of the college.
 * @param categoryId - The name/ID of the category within the college.
 * @param product - The product data to add (without an id, Firestore will generate it).
 * @returns The ID of the newly added product.
 */
export const addProduct = async (collegeId: string, categoryId: string, product: ProductData): Promise<string> => {
  try {
    const productWithTimestamps = {
      ...product,
      stock: product.stock !== undefined ? Number(product.stock) : 0,
      cost: product.cost !== undefined ? Number(product.cost) : 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const productsCollectionRef = collection(db, 'colleges', collegeId, categoryId);
    const docRef = await addDoc(productsCollectionRef, productWithTimestamps);
    console.log('Product added successfully with ID:', docRef.id, 'to path:', `colleges/${collegeId}/${categoryId}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Updates an existing product.
 * @param collegeId - The name/ID of the college.
 * @param categoryId - The name/ID of the category.
 * @param productId - The ID of the product to update.
 * @param updates - An object containing the fields to update.
 */
export const updateProduct = async (collegeId: string, categoryId: string, productId: string, updates: Partial<ProductData>): Promise<void> => {
  try {
    const updateWithTimestamp = {
      ...updates,
      ...(updates.stock !== undefined && { stock: Number(updates.stock) }),
      ...(updates.cost !== undefined && { cost: Number(updates.cost) }),
      updatedAt: serverTimestamp(),
    };
    const productDocRef = doc(db, 'colleges', collegeId, categoryId, productId);
    await updateDoc(productDocRef, updateWithTimestamp);
    console.log('Product updated successfully:', productId, 'in path:', `colleges/${collegeId}/${categoryId}`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Deletes a product.
 * @param collegeId - The name/ID of the college.
 * @param categoryId - The name/ID of the category.
 * @param productId - The ID of the product to delete.
 */
export const deleteProduct = async (collegeId: string, categoryId: string, productId: string): Promise<void> => {
  try {
    const productDocRef = doc(db, 'colleges', collegeId, categoryId, productId);
    await deleteDoc(productDocRef);
    console.log('Product deleted successfully:', productId, 'from path:', `colleges/${collegeId}/${categoryId}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Example usage (you would call these from your admin panel components):
/*
const exampleAddProduct = async () => {
  try {
    const newProduct: ProductData = {
      name: 'Sample T-Shirt',
      price: 25.99,
      description: 'A comfortable cotton t-shirt.',
      imageUrl: 'http://example.com/image.jpg'
    };
    const productId = await addProduct('StateUniversity', 'Apparel', newProduct);
    // You might want to store/use this productId
  } catch (e) {
    // Handle error (e.g., show a notification to the user)
  }
};

const exampleUpdateProduct = async (productIdToUpdate: string) => {
  try {
    const productUpdates: Partial<ProductData> = {
      price: 29.99,
      description: 'An updated comfortable cotton t-shirt with new design.'
    };
    await updateProduct('StateUniversity', 'Apparel', productIdToUpdate, productUpdates);
  } catch (e) {
    // Handle error
  }
};

const exampleDeleteProduct = async (productIdToDelete: string) => {
  try {
    await deleteProduct('StateUniversity', 'Apparel', productIdToDelete);
  } catch (e) {
    // Handle error
  }
};
*/

// It would also be good to have functions to fetch products:
// - fetchProductsByCategory(collegeId, categoryId)
// - fetchProductById(collegeId, categoryId, productId)
// - fetchAllProductsByCollege(collegeId) -> This might require querying across subcollections, which can be more complex.
// - fetchAllCategoriesForCollege(collegeId)
// - fetchAllColleges()

// For now, focusing on CRUD as requested.

// Function to fetch products from a specific category (which is now a direct subcollection of a college)
/**
 * Fetches all products from a specific category subcollection within a college.
 * Example path for products: colleges/collegeName/categoryName/productId
 * @param collegeId - The name/ID of the college.
 * @param categoryId - The name/ID of the category (which is the subcollection name).
 * @returns A promise that resolves to an array of products.
 */
export const fetchProducts = async (collegeId: string, categoryId: string): Promise<Product[]> => {
  try {
    const productsCollectionRef = collection(db, 'colleges', collegeId, categoryId);
    const querySnapshot = await getDocs(productsCollectionRef);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    console.log(`Fetched ${products.length} products from ${collegeId}/${categoryId}`);
    return products;
  } catch (error) {
    console.error(`Error fetching products from ${collegeId}/${categoryId}:`, error);
    throw error;
  }
};

// Placeholder for fetching all categories for a college - useful for dropdowns
export const fetchCategoriesForCollege = async (collegeId: string): Promise<string[]> => {
  try {
    // For the predefined colleges, return the standard list of categories.
    const knownColleges = ['circuits', 'symbiosis', 'access', 'storm', 'chess'];
    const standardProductCategories = ['shirts', 'tote bags', 'lanyards', 'pins', 'stickers'];

    if (knownColleges.includes(collegeId.toLowerCase())) {
      console.log(`Fetched standard categories for known college: ${collegeId}`);
      return standardProductCategories;
    } else {
      // For other colleges, the previous placeholder logic applies or could be an empty list.
      console.warn(`fetchCategoriesForCollege called for an unknown college: ${collegeId}. Returning empty list.`);
      // Firestore client SDKs cannot list subcollections directly without a workaround.
      // Consider having a 'metadata' document for unknown colleges if dynamic categories are needed.
      return []; 
    }
  } catch (error) {
    console.error('Error fetching categories for college:', error);
    throw error;
  }
};

// Placeholder for fetching all colleges - useful for dropdowns
export const fetchAllColleges = async (): Promise<string[]> => {
  try {
    const definedColleges = ['circuits', 'symbiosis', 'access', 'storm', 'chess'];
    console.log(`Fetched defined colleges: ${definedColleges.join(', ')}`);
    return definedColleges;
    
    // Previous logic to fetch from Firestore collection if needed for other dynamic colleges:
    /*
    const collegesCollectionRef = collection(db, 'colleges');
    const querySnapshot = await getDocs(collegesCollectionRef);
    const collegeIds: string[] = [];
    querySnapshot.forEach((doc) => {
      collegeIds.push(doc.id); // Assuming document ID is the college name/ID
    });
    console.log(`Fetched ${collegeIds.length} colleges from Firestore`);
    return collegeIds;
    */
  } catch (error) {
    console.error('Error fetching all colleges:', error);
    throw error;
  }
}; 