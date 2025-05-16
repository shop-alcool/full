const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const routes = require("../routes/routes.js");

const corsOptions = {
   origin: '*',
   methods: ["GET", "POST", "PUT", "DELETE"], 
   allowedHeaders: ["Content-Type", "Authorization"], 
   credentials: true 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
   console.log(`🚀 Server API running at http://localhost:3000`);
});
