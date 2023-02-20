// Starts the server and connects to the database.
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import app from './App.js';
import mongoUtil from './src/Util/mongo.util.js';

// Connect to the database and start the server
async function startServer() {
    await mongoUtil.connect().then(() => {
    app.listen(4000, () => console.log('Listening on port 4000...'));
    });
}

startServer();