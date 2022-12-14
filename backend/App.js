const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello');
})

app.get('/api/users', (req, res) => {
    res.send({Groceries:12, Transport:13 ,Entertainment:4, Other:6});
});

app.listen(4000, () => console.log('Listening on port 4000...'));