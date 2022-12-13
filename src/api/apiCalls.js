// Module Description: Make api calls to the Capital One API
// Author: Vasile Robert Grigoras

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE2NjI0MjI0MDAsImFwaV9zdWIiOiJmMWRkZmMyYTM3NzcyNWE3MjA1ZTViYjM2YjczYWFmMzg2YWE2NWRlMDU5YTM2M2U4YTkwMjg1ZDA3ODViOGRmMTY3NTEyMzIwMDAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTY3NTEyMzIwMCwiZGV2ZWxvcGVyX2lkIjoiZjFkZGZjMmEzNzc3MjVhNzIwNWU1YmIzNmI3M2FhZjM4NmFhNjVkZTA1OWEzNjNlOGE5MDI4NWQwNzg1YjhkZiJ9.VIFGoZj1_UCaIb7IL6Yd_NgmNLUFMcpRpZBsKapkTf-xyT7l9nPIx1Qr_sg6kTRbTR_ZDs2RdX32auHw2n7ypqeeZn1l7ctBdEqr8_7ODwLVVYd9zCq15pfEicLu7waUljnauv-h-kemxj8FrgGgKCCtgXLYAO1wb0Cw3tvkY9BWoSbiA5SU1rp4vBUZJy0Yl26ETkuSupjmkeCGWtjtdqRCw2GdjckXP5jo0Dk_gu5dwSI7Ld4GsgwrttJv5TIpPJzzBIzMKEEFu6sAp1rC2s6uInug6eOG5a-zanjGg1_0y7FBBNdHl2MWp5lIsW9vtxrW0t_MQsOG1DyJrgdjEg";
const unirest = require('unirest');

// Creates a random account (Function)
// Quantity is the number of accounts to be created (Required) (Max 25)
// Callback is the function to be called when the api call is complete (Required)
exports.createRandomAccount = async function (quantity, callback) {
    if(quantity <= 25 && quantity != 0) {
        await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts/create')
        .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'version': '1.0'
        })
        .send({"quantity": quantity})
        .end(function (response) {
        if (response.error) throw new Error(response.error);
        callback(response);
    });
    } else {
        throw new Error("Quantity must be greater than 25 and not 0");
    }
}

// Create a custom account (Function)
// Quantity is the number of accounts to be created (Required) (Max 25)
// Balance is the balance of the account (Optional)
// CreditScore is the credit score of the account (0-999) (Optional)
// CurrencyCode is the currency code of the account (GBP, USD) (Optional)
// ProductType is the product type of the account (Credit or Debit) (Optional)
// RiskScore is the risk score of the account (Optional)
// State is the state of the account (Open or Closed) (Optional)
// CreditLimit is the credit limit of the account (Optional)
// Callback is the function to be called when the api call is complete (Required)
exports.createCustomAccount = async function (quantity, balance, creditScore, currenyCode, 
    productType, riskScore, state, creditLimit, callback) {
    if(quantity <= 25 && quantity != 0) {
        await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts/create')
        .headers({
            'Content-Type': 'application/json',
            'Version': '1.0',
            'Authorization': 'Bearer ' + token
        })
        .send(JSON.stringify({"accounts":[{"balance":balance,"creditScore":creditScore,"currencyCode":currenyCode,"productType":productType,"riskScore":riskScore,"state":state,"creditLimit":creditLimit}]}))
        .end(function (response) {
            if (response.error) throw new Error(response.error);
            callback(response);
        });
    } else {
        throw new Error("Quantity must be greater than 25 and not 0");
    }
}

// Create a random transaction for an account (Function)
// AccountID is the account id of the account to create the transaction for (Required)
// Quantity is the number of transactions to be created (Required) (Max 25)
// Callback is the function to be called when the api call is complete (Required)
exports.createRandomTransaction = async function (accountID, quantity, callback){
    if (quantity <= 25 && quantity != 0) {
        await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/'+ accountID +'/create')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'version': '1.0'
        })
        .send({"quantity": quantity})
        .end(function (response) {
            if (response.error) throw new Error(response.error);
            callback(response.raw_body);
        });
    } else {
        throw new Error("Quantity must be greater than 25 and not 0");
    }
}

// TODO
exports.createCustomTransaction = async function (callback){
    await unirest('POST', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/${accountID}/create')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'version': '1.0'
    })
    .send("{\n\t\"transactions\": [{\"amount\": 1.23}, {\"currency\": \"INR\"}]\n}")
    .end(function (response) {
        if (response.error) throw new Error(response.error);
        callback(response);
    });
}

exports.getAllAccounts = async function (callback){}


exports.getAllTransactions = async function (callback){}


exports.getAccountByID = async function (accountID, callback){
    await unirest('GET', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts/' + accountID)
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'version': '1.0'
    })
    .end(function (response) {
        if (response.error) throw new Error(response.error);
        callback(response);
    });
}

exports.getTransactionByID = async function (transactionID, accountID, callback){
    await unirest('GET', 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/' + accountID + 
    '/transactions/' + transactionID)
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'version': '1.0'
    })
    .end(function (response) {
        if (response.error) throw new Error(response.error);
        callback(response);
    });
}