// Server entry point
// Connects to the database and starts the server
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import app from './app.js';
import { connectToServer } from './mongoUtil.js';

// Connect to the database and start the server
connectToServer( function( err, client ) {
    if (err){
        client.close();
        throw err;
    }
    app.listen(4000, () => console.log('Listening on port 4000...'));
});