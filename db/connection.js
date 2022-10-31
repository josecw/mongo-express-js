const { MongoClient } = require("mongodb");
const config = require('dotenv').config()
const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      console.log("Connecting to MongoDB.");
      dbConnection = db.db(process.env.DB_NAME);
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};