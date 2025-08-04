import React from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeFromCart, clearCart, CartItem } from '../features/cart/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);


  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = async () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to place an order.");
    return;
  }

  const order = {
    userId: user.uid,
    userEmail: user.email,
    items: cartItems,
    totalPrice: Number(totalPrice),
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "orders"), order);
    dispatch(clearCart());
    alert("Checkout successful! Your order has been placed.");
  } catch (error) {
    alert("Failed to place order. Please try again.");
    console.error(error);
  }
};

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p><b>Quantity:</b> {item.quantity}</p>
                <p><b>Price:</b> ${item.price}</p>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
            </div>
          ))}
          <div className="cart-summary">
            <p><b>Total Items:</b> {totalItems}</p>
            <p><b>Total Price:</b> ${totalPrice}</p>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;