import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Corrected path assuming it's in the same directory
import { collection, addDoc } from 'firebase/firestore';

// Interface for the product data
interface NewProduct {
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

const AddProductForm = () => {
    // State to hold the form data
    const [product, setProduct] = useState<NewProduct>({
        name: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        rating: {
            rate: 0,
            count: 0,
        },
    });

    // Handles changes in form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            // Use parseFloat for the price field, otherwise use the value as is
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        if (!product.name || product.price <= 0) {
            alert('Please fill in at least the product name and a valid price.');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "products"), {
                ...product
            });
            console.log("Document written with ID: ", docRef.id);
            alert('Product added successfully! 🎉');
            // Reset form fields
            setProduct({
                name: '',
                price: 0,
                description: '',
                category: '',
                image: '',
                rating: { rate: 0, count: 0 },
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to add product. See console for details.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Product</h2>
            <div>
                <label htmlFor="name">Product Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="category">Category:</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="image">Image URL:</label>
                <input
                    type="text"
                    id="image"
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProductForm;