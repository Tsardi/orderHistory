#E-Commerce with Firebase and order history

## Features

- **User Authentication:** Register, login, and logout using Firebase Auth.
- **Product Listing:** Browse products fetched from [Fake Store API](https://fakestoreapi.com/).
- **Category Filtering:** Filter products by category.
- **Shopping Cart:** Add, remove, and clear items in your cart (cart state persists in session).
- **Order Placement:** Place orders and store them in Firestore with user and cart details.
- **Order History:** View a list of your previous orders, including order details and purchased items.
- **Admin/Product Management:** Add and display products (demo features).
- **Responsive UI:** Built with React functional components and hooks.

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Firebase project (for Auth and Firestore)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecommerce.git
   cd ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
   - Enable Email/Password Authentication and Firestore Database.
   - Copy your Firebase config and replace the placeholder in `src/firebaseConfig.ts`:

     ```typescript
     // src/firebaseConfig.ts
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     ```

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Usage

- Register or log in with your email and password.
- Browse and filter products.
- Add products to your cart.
- Place an order (must be logged in).
- View your order history and order details.
