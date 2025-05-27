const mongoose = require("mongoose");
const dotenv = require("dotenv");

async function connect() {
  dotenv.config();

  try {
    await mongoose.connect(process.env.MONGODB_URL_ON);
    console.log("Connect MongoDB OK");
  } catch (error) {
    console.log("False: MongoDB");
  }
}

module.exports = { connect };
