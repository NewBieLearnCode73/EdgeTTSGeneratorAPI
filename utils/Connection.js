const mongoose = require("mongoose");

function mongoDBConnection(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("Connect to MongoDB successfuly!"))
    .catch((err) => console.error(err));
}

module.exports = mongoDBConnection;