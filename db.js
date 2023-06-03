const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id:{
    type:Number,
    unique:true
  },
  orderDetails: [],
  timestamp: {
    type: Number,
    unique: true
  }
});
const orderItem = mongoose.model('orderItem', orderSchema);

const menuSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  item: {
    type: String,
    unique: true
  },
  price: Number
});
console.log("Schema Created")

const menuItem = mongoose.model('menuItem', menuSchema);

console.log("Model Created")

module.exports = { orderItem, menuItem };