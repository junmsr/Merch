import { db } from "./firebase.config";
import { collection, setDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, getDoc, doc } from "firebase/firestore";

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

interface Cart {
    id: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: any;
    updatedAt?: any;
}

const cartCollection = collection(db, "carts");

const addToCart = async (cartId: string, product: Product, quantity: number) => {
    const cartRef = doc(db, "carts", cartId);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data() as Cart;
        const existingItemIndex = cartData.items.findIndex((item) => item.product.id === product.id);

        let updatedItems: CartItem[];
        if (existingItemIndex !== -1) {
            // Update existing item (create new array, don't mutate)
            updatedItems = cartData.items.map((item, idx) =>
                idx === existingItemIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            // Add new item
            const newItem: CartItem = {
                id: `${product.id}-${Date.now()}`,
                product,
                quantity,
            };
            updatedItems = [...cartData.items, newItem];
        }

        const updatedTotalPrice = updatedItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );

        await updateDoc(cartRef, {
            items: updatedItems,
            totalPrice: updatedTotalPrice,
            updatedAt: serverTimestamp(),
        });
    } else {
        // Create new cart with setDoc to use the provided cartId
        const newCart: Cart = {
            id: cartId,
            items: [
                {
                    id: `${product.id}-${Date.now()}`,
                    product,
                    quantity,
                },
            ],
            totalPrice: product.price * quantity,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        await setDoc(cartRef, newCart);
    }
};

const removeFromCart = async (cartId: string, productId: string) => {
    const cartRef = doc(db, "carts", cartId);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data() as Cart;
        const updatedItems = cartData.items.filter((item) => item.product.id !== productId);
        const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

        await updateDoc(cartRef, {
            items: updatedItems,
            totalPrice: updatedTotalPrice,
            updatedAt: serverTimestamp(),
        });
    }
};

const clearCart = async (cartId: string) => {
    const cartRef = doc(db, "carts", cartId);
    await deleteDoc(cartRef);
};

const getCart = async (cartId: string) => {
    const cartRef = doc(db, "carts", cartId);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
        return cartSnapshot.data() as Cart;
    } else {
        return null;
    }
};

const getAllCarts = async () => {
    const cartSnapshot = await getDocs(cartCollection);
    const carts: Cart[] = [];
    cartSnapshot.forEach((doc) => {
        carts.push({ id: doc.id, ...doc.data() } as Cart);
    });
    return carts;
};

export { addToCart, removeFromCart, clearCart, getCart, getAllCarts };