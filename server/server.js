const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Test Route
app.get("/", (req, res) => {
  res.send("AgroConnect API running...");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => console.error(" MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product'); // <-- Contains /add-product
const cropRoutes=require('./routes/crop');
const adminRoutes = require('./routes/admin');

const diagnosisRoutes = require('./routes/diagnosis');
const resourceRoutes=require('./routes/resources');
const schemeRoutes=require('./routes/scheme');




// Route Middleware
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/crops',cropRoutes); 
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/resources',resourceRoutes );
app.use('/api/scheme',schemeRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

 // path to product.js

app.use('/uploads/resources', express.static('uploads/resources'));



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at: http://localhost:${PORT}`);
});
