import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Define a type for your item for better type-safety
interface Product {
    id: string;
    name: string;
    // add other properties of your item here
    price?: number;
}

const FakeItems = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // The collection is named 'products'
        const productsCollectionRef = collection(db, 'product');

        // Set up a real-time listener
        const unsubscribe = onSnapshot(productsCollectionRef,
            (snapshot: QuerySnapshot<DocumentData>) => {
                const fetchedProducts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(fetchedProducts);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError('Failed to fetch products from Firestore.');
                setLoading(false);
            }
        );

        // Cleanup: Unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []); // The empty dependency array ensures this effect runs only once on mount

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Products from Firestore</h2>
            {products.length > 0 ? (
                <ul>{products.map(product => <li key={product.id}>{product.name} - ${product.price || 'N/A'}</li>)}</ul>
            ) : (<p>No products found.</p>)}
        </div>
    );
};

export default FakeItems;
