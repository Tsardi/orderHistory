import React from 'react';
import { useDispatch } from 'react-redux';
import { Product as ProductType } from '../services/api';
import { addToCart } from '../features/cart/cartSlice';

interface Props {
  product: ProductType;
}

const Product: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="product">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p><b>Category:</b> {product.category}</p>
      <p><b>Price:</b> ${product.price}</p>
      <p><b>Rating:</b> {product.rating.rate} ({product.rating.count} reviews)</p>
      <button className="add-to-cart-btn" onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
    </div>
  );
};

export default Product;