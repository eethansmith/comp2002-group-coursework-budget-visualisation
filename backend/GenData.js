// Generate script for populating the database with Capital One API data
// Author: Vasile Robert Grigoras (PSYVG1)
const unirest = require('unirest');
// MongoDB driver
const MongoClient = require('mongodb').MongoClient;

// Capital One API token
// Add your own token here
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE2Njk2ODAwMDAsImFwaV9zdWIiOiJmMWRkZmMyYTM3NzcyNWE3MjA1ZTViYjM2YjczYWFmMzg2YWE2NWRlMDU5YTM2M2U4YTkwMjg1ZDA3ODViOGRmMTY5NjAzMjAwMDAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTY5NjAzMjAwMCwiZGV2ZWxvcGVyX2lkIjoiZjFkZGZjMmEzNzc3MjVhNzIwNWU1YmIzNmI3M2FhZjM4NmFhNjVkZTA1OWEzNjNlOGE5MDI4NWQwNzg1YjhkZiJ9.ec7L77UdUdyvDz9ku7gRdEo0aWTd_fGZP4fkKKAfD4uNQ6rv5P_ZgVPCpHwtHtyoghTiaKBwOaPww6PZyx4iWSZP9kH4Wh22XcSMV1jDgFx-3dhwgPSYwAgApMm_SCEI2QNETa8pLgdJdi-E7LipYbBMgoG-IPcl4BoiP6LTZc4HzLW-ZoMQF6iSAfi7izsl-mmr-76tevcWhLuR2gEqhTqyScoYFSxMERUr2u5QmGhPPbh0I30Bgz5V9JcGUDJCtPknRlka3ZlrKsw5Cqz5UnZ2VH47B-rYEBLFZfs5GXwPjrsWCzMec98CyL2oB8NcBzaBD3COV2Rdq74X5sbO9Q";
// MongoDB connection string
const url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";
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
      
    if (response.error) throw new Error(response.raw_body);

    let jsonStringTransaction = JSON.stringify(response.raw_body);
    let jsonObjectTransaction = JSON.parse(jsonStringTransaction);

    // Change AcountUUID, MerchantUUID to a integer
    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      jsonObjectTransaction.Transactions[i].accountUUID = parseInt(jsonObjectTransaction.Transactions[i].accountUUID);
      jsonObjectTransaction.Transactions[i].merchantUUID = parseInt(jsonObjectTransaction.Transactions[i].merchantUUID);
      jsonObjectTransaction.Transactions[i].date = new Date(jsonObjectTransaction.Transactions[i].timestamp).toISOString();
    }

    // Remove latitude, longtitude and emoji
    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      delete jsonObjectTransaction.Transactions[i].latitude;
      delete jsonObjectTransaction.Transactions[i].longitude;
      delete jsonObjectTransaction.Transactions[i].emoji;
      delete jsonObjectTransaction.Transactions[i].timestamp;
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

      // Change the accountID, creditScore, riskScore, UCI to a integer
      jsonObjectAccount.Accounts[0].accountId = parseInt(jsonObjectAccount.Accounts[0].accountId);
      jsonObjectAccount.Accounts[0].creditScore = parseInt(jsonObjectAccount.Accounts[0].creditScore);
      jsonObjectAccount.Accounts[0].riskScore = parseInt(jsonObjectAccount.Accounts[0].riskScore);
      jsonObjectAccount.Accounts[0].uci = parseInt(jsonObjectAccount.Accounts[0].uci);
      // Change the balance, creditLimit to a float
      jsonObjectAccount.Accounts[0].balance = parseFloat(jsonObjectAccount.Accounts[0].balance);
      jsonObjectAccount.Accounts[0].creditLimit = parseFloat(jsonObjectAccount.Accounts[0].creditLimit);

      // Delete developerId, liveBalance
      delete jsonObjectAccount.Accounts[0].developerId;
      delete jsonObjectAccount.Accounts[0].liveBalance;

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

callback = function (accountID) {
  console.log(accountID);
  // Create 100 transactions for each account (min)
  for (let i = 0; i < 5; i++) {
    AddTransactions(25, accountID);
  }
}

// Run the script
AddCustomAccount(callback);
