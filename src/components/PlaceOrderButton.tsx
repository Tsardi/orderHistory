import React from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Define the structure of a cart item and the current user
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CurrentUser {
    uid: string;
    email: string;
}

interface PlaceOrderButtonProps {
    cartItems: CartItem[];
    currentUser: CurrentUser;
    onOrderPlaced: () => void; // A function to clear the cart after ordering
}

const PlaceOrderButton = ({ cartItems, currentUser, onOrderPlaced }: PlaceOrderButtonProps) => {

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Calculate the total price of the order
        const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Create the order object
        const newOrder = {
            userId: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
            items: cartItems,
            totalPrice: totalPrice,
        };

        try {
            // Add the new order to the "orders" collection
            const docRef = await addDoc(collection(db, "orders"), newOrder);
            alert(`Order placed successfully! Your order ID is: ${docRef.id}`);
            onOrderPlaced(); // Call the parent function to clear the cart
        } catch (error) {
            console.error("Error placing order: ", error);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <button onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            Place Order
        </button>
    );
};

export default PlaceOrderButton;