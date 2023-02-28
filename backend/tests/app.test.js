// Test app.js includes the account and transaction routes and their controllers
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import request from 'supertest';
import app from '../app.js';
import mongoUtil from '../src/Util/mongo.util.js';

// Connect to the database
beforeAll(async () => {
    await mongoUtil.connect();
});

// Test the account route
describe('Test - Account Route (/api/account/)', () => {
    // Test 1.1 - Base Account Route
    // Test the base account route returns 200
    test('Test 1.1 - Base Account Route', async () => {
        const response = await request(app).get('/api/account');
        expect(response.statusCode).toBe(200);
    });
    
    // Test 2.1 - Random Account Route
    // Test the random account route returns a JSON object and 200
    test('Test 2.2 - Random Account Route', async () => {
        const response = await request(app).get('/api/account/random');
        expect(response.type).toBe('application/json');
        expect(response.statusCode).toBe(200);
    });

    // Test 3.1 - Account Route
    // Test the account route returns a JSON object and 200
    test('Test 3.1 - Account Route', async () => {
        const response = await request(app).get('/api/account/0');
        expect(response.type).toBe('application/json');
        expect(response.statusCode).toBe(200);
    });

    // Test 3.2 - Account Route
    // Test the account route returns an empty JSON object when the account does not exist and 200
    test('Test 3.2 - Account Route', async () => {
        const response = await request(app).get('/api/account/0');
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual({});
        expect(response.statusCode).toBe(200);
    });

    // Test 3.3 - Account Route
    // Test the account route returns an error when the accountID is not a number
    test('Test 3.3 - Account Route', async () => {
        const response = await request(app).get('/api/account/a#');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Type error, accountID (int)');
        expect(response.statusCode).toBe(400);
    });
});

// Test the transaction route
describe('Test - Transaction Route (/api/transactions/)', () => {
    // Test 1.1 - Base Transaction Route
    // Test the base transaction route returns 200
    test('Test 1.1 - Base Transaction Route', async () => {
        const response = await request(app).get('/api/transactions');
        expect(response.type).toBe("text/html");
        expect(response.text).toBe("Transaction route");
        expect(response.statusCode).toBe(200);
    });

    // Test 2.1 - Get Transactions Route
    // Test that an error is returned when the accountID is not a number
    test('Test 2.1 - Get Transactions Route', async () => {
        const response = await request(app).get('/api/transactions/abc/1638811706/daily');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Type error, accountID (int) timeframe (string) date (int)');
        expect(response.statusCode).toBe(400);
    });

    // Test 2.2 - Get Transactions Route
    // Test that an error is returned when the date is not a number
    test('Test 2.2 - Get Transactions Route', async () => {
        const response = await request(app).get('/api/transactions/0/abc/daily');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Type error, accountID (int) timeframe (string) date (int)');
        expect(response.statusCode).toBe(400);
    });

    // Test 2.3 - Get Transactions Route
    // Test that an error is returned when the timeframe is not "daily" or "monthly"
    test('Test 2.3 - Get Transactions Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/abc');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Invalid timeframe, must be "daily" or "monthly"');
        expect(response.statusCode).toBe(400);
    });

    // Test 2.4 - Get Transactions Route
    // Test a json object is returned when the accountID, date and timeframe are valid
    test('Test 2.4 - Get Transactions Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/daily');
        expect(response.type).toBe('application/json');
        expect(response.statusCode).toBe(200);
    });

    // Test 2.5 - Get Transactions Route
    // Test an empty json object is returned when the accountID, date and timeframe are valid but there are no transactions
    test('Test 2.5 - Get Transactions Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/daily');
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual({});
        expect(response.statusCode).toBe(200);
    });

    // Test 3.1 - Get Transaction Categories Route
    // Test that an error is returned when the accountID is not a number
    test('Test 3.1 - Get Transaction Categories Route', async () => {
        const response = await request(app).get('/api/transactions/abc/1638811706/daily/categories');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Type error, accountID (int) timeframe (string) date (int)');
        expect(response.statusCode).toBe(400);
    });

    // Test 3.2 - Get Transaction Categories Route
    // Test that an error is returned when the date is not a number
    test('Test 3.2 - Get Transaction Categories Route', async () => {
        const response = await request(app).get('/api/transactions/0/abc/daily/categories');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Type error, accountID (int) timeframe (string) date (int)');
        expect(response.statusCode).toBe(400);
    });

    // Test 3.3 - Get Transaction Categories Route
    // Test that an error is returned when the timeframe is not "daily" or "monthly"
    test('Test 3.3 - Get Transaction Categories Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/abc/categories');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Invalid timeframe, must be "daily" or "monthly"');
        expect(response.statusCode).toBe(400);
    });

    // Test 3.4 - Get Transaction Categories Route
    // Test an error is returned when the category is not a valid category
    test('Test 3.4 - Get Transaction Categories Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/daily/abc');
        expect(response.type).toBe('text/html');
        expect(response.text).toStrictEqual('Invalid category');
        expect(response.statusCode).toBe(400);
    });

    // Test 3.5 - Get Transaction Categories Route
    // Test a json object is returned when the accountID, date, timeframeare and category valid
    test('Test 3.5 - Get Transaction Categories Route', async () => {
        const response = await request(app).get('/api/transactions/0/1638811706/daily/Education');
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual({});
        expect(response.statusCode).toBe(200);
    });

});

// Close the database connection
afterAll(async () => {
    await mongoUtil.closeConnection();
});