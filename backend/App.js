const express = require('express');
const app = express();

app.get('/',(req, res) => {
    res.send('Hi');
});

app.get('/api/users', (req, res) => {
    res.send({Groceries:12, Transport:13 ,Entertainment:4, Other:6})
});

app.listen(4000, () => console.log('Listening on port 4000...'))