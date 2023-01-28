// Generate script for populating the database with Capital One API data
// Author: Vasile Robert Grigoras (PSYVG1)
const unirest = require('unirest');
// MongoDB driver
const MongoClient = require('mongodb').MongoClient;

// Capital One API token
// Add your own token here
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE2NjI0MjI0MDAsImFwaV9zdWIiOiJmMWRkZmMyYTM3NzcyNWE3MjA1ZTViYjM2YjczYWFmMzg2YWE2NWRlMDU5YTM2M2U4YTkwMjg1ZDA3ODViOGRmMTY3NTEyMzIwMDAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTY3NTEyMzIwMCwiZGV2ZWxvcGVyX2lkIjoiZjFkZGZjMmEzNzc3MjVhNzIwNWU1YmIzNmI3M2FhZjM4NmFhNjVkZTA1OWEzNjNlOGE5MDI4NWQwNzg1YjhkZiJ9.VIFGoZj1_UCaIb7IL6Yd_NgmNLUFMcpRpZBsKapkTf-xyT7l9nPIx1Qr_sg6kTRbTR_ZDs2RdX32auHw2n7ypqeeZn1l7ctBdEqr8_7ODwLVVYd9zCq15pfEicLu7waUljnauv-h-kemxj8FrgGgKCCtgXLYAO1wb0Cw3tvkY9BWoSbiA5SU1rp4vBUZJy0Yl26ETkuSupjmkeCGWtjtdqRCw2GdjckXP5jo0Dk_gu5dwSI7Ld4GsgwrttJv5TIpPJzzBIzMKEEFu6sAp1rC2s6uInug6eOG5a-zanjGg1_0y7FBBNdHl2MWp5lIsW9vtxrW0t_MQsOG1DyJrgdjEg";
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

    // Remove latitude, longtitude and emoji
    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      delete jsonObjectTransaction.Transactions[i].latitude;
      delete jsonObjectTransaction.Transactions[i].longitude;
      delete jsonObjectTransaction.Transactions[i].emoji;
    }

    // Change AcountUUID, MerchantUUID to a integer
    for (let i = 0; i < jsonObjectTransaction.Transactions.length; i++) {
      jsonObjectTransaction.Transactions[i].accountUUID = parseInt(jsonObjectTransaction.Transactions[i].accountUUID);
      jsonObjectTransaction.Transactions[i].merchantUUID = parseInt(jsonObjectTransaction.Transactions[i].merchantUUID);
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

  .send(JSON.stringify({"accounts":[{"balance":null,"creditScore":null,"currencyCode":null,
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
  // Create 250 transactions for each account (min)
  for (let i = 0; i < 1; i++) {
    AddTransactions(25, accountID);
  }
}

// Run the script
AddCustomAccount(callback);
