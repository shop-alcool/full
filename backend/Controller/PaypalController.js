const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

// Configuration de l'environnement PayPal
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// Vérification d'un paiement PayPal
async function verifyOrder(req, res) {
  const { orderID } = req.body;
  if (!orderID) return res.status(400).json({ error: 'orderID manquant' });

  const request = new paypal.orders.OrdersGetRequest(orderID);
  try {
    const response = await client().execute(request);
    // Ici tu peux enregistrer la commande dans ta BDD si tu veux
    return res.status(200).json({ status: response.result.status, details: response.result });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la vérification PayPal', details: err.message });
  }
}

module.exports = { verifyOrder };
