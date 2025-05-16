import { db } from './firebase.config';
import { collection, doc, addDoc, updateDoc, getDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { auth } from './firebase.config';

interface Transaction {
  id?: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    college: string;
    category: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: any;
  updatedAt: any;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

// Create a new transaction
export const createTransaction = async (items: any[], totalAmount: number): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const transactionData: Omit<Transaction, 'id'> = {
      userId: user.uid,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        college: item.college,
        category: item.category
      })),
      totalAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const transactionRef = await addDoc(collection(db, 'transactions'), transactionData);
    return transactionRef.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Update transaction status
export const updateTransactionStatus = async (transactionId: string, status: Transaction['status']) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

// Get user's transactions
export const getUserTransactions = async (status?: Transaction['status']) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
};

// Update product stock
export const updateProductStock = async (college: string, category: string, productId: string, quantity: number) => {
  try {
    const productRef = doc(db, 'colleges', college.toLowerCase(), category.toLowerCase(), productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      throw new Error(`Product not found in ${college}/${category}`);
    }

    const currentStock = productDoc.data().stock || 0;
    const newStock = currentStock - quantity;

    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await updateDoc(productRef, {
      stock: newStock,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as UserProfile;
    }

    // If user profile doesn't exist, create one
    const newProfile: Omit<UserProfile, 'id'> = {
      name: user.displayName || 'User',
      email: user.email || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, newProfile);
    return {
      id: user.uid,
      ...newProfile
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 