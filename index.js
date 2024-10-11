const express = require('express');
const app = express();

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Server running at port ${port}`);
});

app.listen(port);