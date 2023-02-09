const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = () => {

  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL)
    .then((e) => {
      console.log("DB Connected to " + e.connection.name);
    })
    .catch((error) => {
      console.log("Connection error: " + error);
    });

};

module.exports = connectToDB;
