// MongoUtil.js
// Singleton class that provides a function to connect to the database. 
// Get the database/client and close the connection.
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import { MongoClient } from 'mongodb';

// MongoUtil Singleton class
// Description: Connect, get database/client and close the connection to the database
// Author: Vasile Grigoras (PSYVG1)
class MongoUtil {
  // Singleton instance
  constructor() {
    if (MongoUtil.instance) {
      return MongoUtil.instance;
    }
  
    // Initialise the database and set variables
    this._db = null;
    this._client = null;
    this._url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";
  
    // Set the instance
    MongoUtil.instance = this;
  }
  
  // Connect to the database
  async connect() {
    if (this._db) {
      return this._db;
    }
    
    try {
      const client = await MongoClient.connect(this._url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
      
    // Set the database and client
    this._client = client;
    this._db = client.db('BudgetVisualisation');
  
    return this._db;

    } catch (error) {
      // Log the error
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  
  // Get the database
  // Returns the database
  async getDB() {
    if (!this._db) {
      await this.connect();
    }
    return this._db;
  }

  // Get the client
  // Returns the client
  async getClient() {
    if (!this._client) {
      await this.connect();
    }
    return this._client;
  }

  // Close the connection
  // Returns true if the connection is closed
  async closeConnection() {
    if (this._client) {
      await this._client.close();
      this._db = null;
      this._client = null;
    }
    return true;
  }

}

const mongoUtil = new MongoUtil();
export default mongoUtil;
  