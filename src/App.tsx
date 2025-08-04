import { useEffect, useState } from "react";
import { auth, db } from './firebaseConfig';
import React from 'react';
import Home from './components/Home';
import Cart from './components/Cart';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import { onAuthStateChanged, User, deleteUser as deleteAuthUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import AddDataForm from "./components/AddDataForm";
import DisplayData from "./components/DisplayData";
import FakeItems from "./components/FakeItems";
import AddProductForm from "./components/AddProduct";
import ProductList from "./components/ProductList";
import OrderHistory from "./components/OrderHistory";

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("No user is currently signed in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      try {
        // 1. Delete the user's document from the 'users' collection in Firestore.
        await deleteDoc(doc(db, "users", currentUser.uid));

        // 2. Delete the user from Firebase Authentication.
        await deleteAuthUser(currentUser);

        alert("Your account has been successfully deleted.");
        // The onAuthStateChanged listener will automatically update the UI to the logged-out state.
      } catch (error: any) {
        console.error("Error deleting account:", error);
        alert(`Failed to delete account: ${error.message}. You may need to sign out and sign back in before you can delete your account.`);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-Commerce Store</h1>
        <h2>{user ? `welcome, ${user.email}` : "welcome, Guest"}</h2>
        {user && <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>}
        <h3>Register w/ firebase here: <Register /></h3>
        <Login user={user} />
      </header>
      <main>
        <Home />
        <Cart />
        {user && <OrderHistory userId={user.uid} />}
        {/* <AddDataForm /> */}
        <AddProductForm />
        <DisplayData />
        <FakeItems />
        <ProductList />
      </main>
    </div>
  );
};

export default App;