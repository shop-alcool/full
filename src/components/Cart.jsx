/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import CartContext from './CartContext';

const Cart = () => {
  const { cart } = useContext(CartContext);
  const paypalRef = useRef();

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=API_KEY_HERE`;//API KEY HERE
    script.addEventListener("load", () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
            const { clearCart } = useContext(CartContext);
            clearCart();
          });
        }
      }).render(paypalRef.current);
    });
    document.body.appendChild(script);
  }, [total]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Cart
      </Typography>
      <List>
        {cart.map((product) => (
          <ListItem key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={`$${product.price}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Total: ${total}
      </Typography>

      <div ref={paypalRef} />
    </Container>
  );
};

export default Cart;
