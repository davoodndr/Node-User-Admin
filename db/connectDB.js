const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const con = await mongoose.connect('mongodb://localhost:27017/userAuth',{});
    console.log(`MongoDB connected : ${con.connection.host}`);    
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB