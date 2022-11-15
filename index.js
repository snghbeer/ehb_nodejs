require('dotenv').config();
const express = require('express');
//const cookieParser = require('cookie-parser')

const homeRouter = require('./routes/router');
const app = express();

const dbURI = process.env.dbURI;
const PORT = process.env.PORT || 3000 ;

//app.use(cookieParser())
app.use('/api', homeRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

app.get('/', async function (req, res) {
    res.send("Welcome to home page")
  })