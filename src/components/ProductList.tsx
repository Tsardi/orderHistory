import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Product interface remains the same
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // State to manage which product is being edited
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const productsCollectionRef = collection(db, "products");
        const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })) as Product[];
            setProducts(productsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- Delete Function ---
    const handleDelete = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const productDocRef = doc(db, 'products', productId);
                await deleteDoc(productDocRef);
                alert('Product deleted successfully! 🗑️');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Failed to delete product.');
            }
        }
    };

    // --- Update Functions ---
    // 1. Set the product to be edited
    const handleEdit = (product: Product) => {
        setEditingProduct({ ...product });
    };

    // 2. Handle changes in the edit form
    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingProduct) return;
        const { name, value } = e.target;
        setEditingProduct({
            ...editingProduct,
            [name]: name === 'price' ? parseFloat(value) : value,
        });
    };

    // 3. Submit the update to Firestore
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const productDocRef = doc(db, 'products', editingProduct.id);
            // Create a temporary object without the 'id' field for updating
            const { id, ...dataToUpdate } = editingProduct;
            await updateDoc(productDocRef, dataToUpdate);
            
            alert('Product updated successfully! ✅');
            setEditingProduct(null); // Exit editing mode
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Failed to update product.');
        }
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div>
            <h2>Our Products</h2>
            {/* --- Edit Form (Modal-like) --- */}
            {editingProduct && (
                <div className="edit-modal">
                    <form onSubmit={handleUpdateSubmit}>
                        <h3>Edit Product ✏️</h3>
                        <input name="name" value={editingProduct.name} onChange={handleUpdateChange} />
                        <input name="price" type="number" value={editingProduct.price} onChange={handleUpdateChange} />
                        <textarea name="description" value={editingProduct.description} onChange={handleUpdateChange} />
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {/* --- Product Grid --- */}
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price.toFixed(2)}</p>
                        <p>{product.description}</p>
                        <div className="card-actions">
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;