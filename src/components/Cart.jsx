/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CartContext from './CartContext';

const Cart = () => {
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const paypalRef = useRef();
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  useEffect(() => {
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    const existingScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=Ael7iDNbmWhX1spCOhefI9sKZUfjKaaoCfItakYNXPWNMmJ9rA1qF22YDJm9N2hp0AHS0UjopQ5kuNc4`;
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
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async (details) => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);

            try {
              await fetch('http://localhost:3000/paypal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID })
              });
            } 
            
            catch (err) {
              console.error('Erreur lors de la vérification du paiement côté serveur', err);
            }

            clearCart();
          });
        }
      }).render(paypalRef.current);
    });
    document.body.appendChild(script);

    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }

      const oldScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');

      if (oldScript) {
        oldScript.remove();
      }
    };
  }, [total, clearCart]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Cart
      </Typography>
      <List>
        {cart.map((product, idx) => (
          <ListItem key={product.id + '-' + idx} secondaryAction={
            <CloseIcon
              sx={{ cursor: 'pointer', color: 'red' }}
              onClick={() => removeFromCart(idx)}
            />
          }>
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
