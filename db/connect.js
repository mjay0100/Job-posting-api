const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url).then(() => console.log("Connected DB"));
};

module.exports = connectDB;
