const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Server is ready")
});

app.listen(3000, ()=> {
    console.log(`Server is started and running on ${PORT}`);
});