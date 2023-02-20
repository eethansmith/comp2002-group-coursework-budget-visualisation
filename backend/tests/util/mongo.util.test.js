// Mongo Util Test
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import mongoUtil from '../../src/util/mongo.util.js';

// Connect to the database
beforeAll(async () => {
    await mongoUtil.connect();
});

// Test 2.1
// Test database connection is not null - connection is successful
test('Test 2.1', async () => {
    // Get the client
    const client = await mongoUtil.getClient();
    // Check if the client is connected
    expect(client).not.toBeNull();
});

// Test 2.2
// Test getDB() function returns the database
test('Test 2.2', async () => {
    // Get the database
    const db = await mongoUtil.getDB();
    // Check if the database is connected
    expect(db).not.toBeNull();
});

// Test 2.3
// Test getDB() function returns not null - connection is created if none exists
test('Test 2.3', async () => {
    // Get the database
    const db = await mongoUtil.getDB();
    // Check if the database is connected
    expect(db).not.toBeNull();
});

// Test 2.4
// Test getClient() function returns not null - connection is created if none exists
test('Test 2.4', async () => {
    // Get the client
    const client = await mongoUtil.getClient();
    // Check if the client is connected
    expect(client).not.toBeNull();
});

// Test 2.5
// Test closeConnection() function closes the connection
test('Test 2.5', async () => {
    // Close the connection
    const connection = await mongoUtil.closeConnection();
    // Check if the client is connected
    expect(connection).toBe(true);
});

// Close the connection
afterAll(async () => {
    await mongoUtil.closeConnection();
});