// MongoUtil.js
// Helps with reusing the MongoDB connection 
// Provides a function to connect to the database, get the database and close the connection
// Author: Vasile Grigoras (PSYVG1)

// Import modules
const MongoClient = require('mongodb').MongoClient;
// MongoDB connection string
const url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";
// Database name
var _db;

module.exports = {
    // Connect to the database
    connectToServer: function( callback ) {
      MongoClient.connect( url,  { useNewUrlParser: true }, 
        function( err, client ) {
            _db  = client.db('BudgetVisualisation');
            return callback( err );
        });
    },
    // Get the database
    getDB: function() {
      return _db;
    }
};