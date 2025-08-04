import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; //instead of useEffect and useState
import { fetchProducts, fetchCategories } from '../services/api';
import Product from './Product';
import { Product as ProductType } from '../services/api';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (productsLoading || categoriesLoading) return <div>Loading...</div>;
  if (productsError instanceof Error) return <div>Error fetching products: {productsError.message}</div>;
  if (categoriesError instanceof Error) return <div>Error fetching categories: {categoriesError.message}</div>;

  return (
    <div>
      <h2>Products</h2>
      <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory || ''}>
        <option value="">All Categories</option>
        {categories?.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="product-list">
        {products?.map((product: ProductType) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;