import React from 'react';
import Home from './components/Home'
import Cart from './components/Cart';
import Register from './components/Register'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>E-Commerce Store</h1>
        <Register />
      </header>
      <main>
        <Home />
        <Cart />
      </main>
    </div>
  );
};

export default App;