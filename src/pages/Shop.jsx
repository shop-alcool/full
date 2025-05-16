/* eslint-disable no-unused-vars */
import { Container, Box, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useEffect, useState, useContext } from 'react';
import { getProducts } from '../api/api.jsx';
import CartContext from '../components/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProducts()
      .then(response => setProducts(response))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Shop
      </Typography>
      <Box 
        display="grid"
        gridTemplateColumns={{
          xs: '1fr', 
          sm: '1fr 1fr', 
          md: '1fr 1fr 1fr' 
        }}
        gap={4}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </Box>
    </Container>
  );
};

export default Shop;
