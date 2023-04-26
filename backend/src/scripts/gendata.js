// Generate script for populating the database with Capital One API data
// Author: Vasile Robert Grigoras (PSYVG1)
import unirest from 'unirest';
// MongoDB driver
import { MongoClient } from 'mongodb';

// Capital One API token
// Add your own token here
const token = "";
// MongoDB connection string
const url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";

// Helper function
// Add detailed subcategories to a category
// Note - For future use
function AddDetailedSubcategories(category) {
  if(category === "Food & Dining") {
    return ["Restaurants", "Groceries", "Fast Food", "Coffee Shops", "Bars", "Alcohol", "Dining Out", 
    "Takeaway", "Supermarkets"];
  } else if(category === "Bills & Utilities") {
    return ["Mobile", "Internet", "Electricity", "Gas", "Water", "Council Tax", "TV License", "Home Phone"];
  } else if(category === "Shopping") {
    return ["Clothes", "Electronics", "Books", "Toys", "Sports", "Home", "Garden", "Pets", 
    "Beauty", "Health", "Jewellery", "Gifts", "Flowers", "Stationery", "Furniture", "Car", 
    "Travel", "Holidays", "Entertainment", "Music", "Games", "Movies", "Tickets", "Other"];
  } else if(category === "Auto & Transport") {
    return ["Taxi", "Train", "Bus", "Car", "Parking", "Bike", "Plane", "Boat", "Other"];
  } else if(category === "Personal Care") {
    return ["Hair", "Nails", "Spa", "Gym", "Sports", "Health", "Beauty", "Other"];
  } else if(category === "Entertainment") {
    return ["Music", "Games", "Movies", "Tickets", "Sports", "Other"];
  } else if(category === "Education") {
    return ["Books", "School", "Tuition", "Other"];
  } else if(category === "Gifts & Donations") {
    return ["Charity", "Gifts", "Donations", "Other"];
  }
}

// Helper function
// Add basic subcategories to a category
function AddSubcategories(category) {
  if(category === "Bills & Utilities") {
    return "Bills";
  } else if (category === "Food & Dining") {
    return "Groceries";
  } else{
    return "Other";
  }
}

// Create a number of transactions for a specific account
async function AddTransactions(quantity, accountID) {
    await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/'
    + accountID +'/create')

    .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'version': '1.0'
    })

    .send({"quantity": quantity})
    .end(function (response) {
      
    if (response.error){
      // Delete the account if the transaction creation fails
      MongoClient.connect(url, function (err, db) {
        if (err)
          throw err;
        var dbo = db.db("BudgetVisualisation");
        var query = { accountID: accountID };
        dbo.collection("Accounts").deleteOne(query, function (err, obj) {
          if (err)
            throw err;
          console.log("Account deleted");
          db.close();
        });
      });
      console.log("Deleted account due to error: " + response.error);
      return;
    }

    // Parse the response
    let jsonStringTransaction = JSON.stringify(response.raw_body);
    let jsonObjectTransaction = JSON.parse(jsonStringTransaction);

    // Change AcountUUID, MerchantUUID to a integer
    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      jsonObjectTransaction.Transactions[i].accountID = parseInt(jsonObjectTransaction.Transactions[i].accountUUID);
      jsonObjectTransaction.Transactions[i].merchantID = parseInt(jsonObjectTransaction.Transactions[i].merchantUUID);
      jsonObjectTransaction.Transactions[i].date = new Date(jsonObjectTransaction.Transactions[i].timestamp).toISOString();
      jsonObjectTransaction.Transactions[i].merchant.subcategory = AddSubcategories(jsonObjectTransaction.Transactions[i].merchant.category);
    }

    // Remove latitude, longtitude, emoji, merchant description, timestamp, pointofsale (merchant)
    // Remove accountUUID, merchantUUID - changed to accountID, merchantID

    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      // Changed
      delete jsonObjectTransaction.Transactions[i].accountUUID;
      delete jsonObjectTransaction.Transactions[i].merchantUUID;
      // Removed
      delete jsonObjectTransaction.Transactions[i].latitude;
      delete jsonObjectTransaction.Transactions[i].longitude;
      delete jsonObjectTransaction.Transactions[i].emoji;
      delete jsonObjectTransaction.Transactions[i].timestamp;
      delete jsonObjectTransaction.Transactions[i].merchant.description;
      delete jsonObjectTransaction.Transactions[i].merchant.pointOfSale;
    }

    MongoClient.connect(url, function (err, db) {
      if (err)
        throw err;
      var dbo = db.db("BudgetVisualisation");
      dbo.collection("Transactions").insertMany(jsonObjectTransaction.Transactions, function (err) {
        if (err)
          throw err;
        console.log("Transactions added");
        db.close();
      });
    });
  });
}

// Create a custom account that is required to be open for transactions to be created
async function AddCustomAccount (callback) {
  await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts/create')
  .headers({
      'Content-Type': 'application/json',
      'Version': '1.0',
      'Authorization': 'Bearer ' + token
  })

  .send(JSON.stringify({"accounts":[{"balance":null,"creditScore":null,"currencyCode":"GBP",
  "productType":null,"riskScore":null,"state":"open","creditLimit":null}]}))
  .end(async function (response) {

      if (response.error) throw new Error(response.raw_body);
      
      let jsonObjectAccount = JSON.parse(response.raw_body);
      let accountID = jsonObjectAccount.Accounts[0].accountId;

      // Check accountID is 8 digits
      if (accountID.length !== 8) {
        console.log("AccountID is not 8 digits (Equality)" + accountID);
        AddCustomAccount(callbackAccount);
      }

      // Change the accountID, creditScore, riskScore, UCI to a integer
      jsonObjectAccount.Accounts[0].accountID = parseInt(jsonObjectAccount.Accounts[0].accountId);
      jsonObjectAccount.Accounts[0].creditScore = parseInt(jsonObjectAccount.Accounts[0].creditScore);
      jsonObjectAccount.Accounts[0].riskScore = parseInt(jsonObjectAccount.Accounts[0].riskScore);
      jsonObjectAccount.Accounts[0].uci = parseInt(jsonObjectAccount.Accounts[0].uci);
      // Change the balance, creditLimit to a float
      jsonObjectAccount.Accounts[0].balance = parseFloat(jsonObjectAccount.Accounts[0].balance);
      jsonObjectAccount.Accounts[0].creditLimit = parseFloat(jsonObjectAccount.Accounts[0].creditLimit);

      // Delete accountId (replaced by accountID), developerId, liveBalance
      delete jsonObjectAccount.Accounts[0].developerId;
      delete jsonObjectAccount.Accounts[0].liveBalance;
      delete jsonObjectAccount.Accounts[0].accountId;

      // Adds the account to the mongo database
      MongoClient.connect(url, function (err, db) {
        if (err)
          throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Accounts").insertMany(jsonObjectAccount.Accounts, function (err) {
          if (err)
            throw err;
          console.log("Accounts added");
          db.close();
        });
      });

      callback(accountID);
  });
}

function callbackAccount (accountID) {
  console.log(accountID);
  // Create 100 transactions for each account (min)
  for (let i = 0; i < 5; i++) {
    AddTransactions(25, accountID);
  }
}

// Run the script
AddCustomAccount(callbackAccount);
