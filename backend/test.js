const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://seearun20:2004%40aruLL@cluster0.zkmeena.mongodb.net/productdb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));