require('dotenv').config();
const express = require('express');
//const cookieParser = require('cookie-parser')

const homeRouter = require('./routes/router');
const app = express();
const path = require('path');
const cors = require('cors');

const dbURI = process.env.dbURI;
const PORT = process.env.PORT || 3000 ;

//Server setup
app.set('views', path.join(__dirname, 'views'));// all html templates will be rendered from views folder
app.set('view engine', 'ejs');

//CSS setup
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(cors({
    credentials: true,
    origin: true
}));

app.use('/api', homeRouter);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

app.get('/', async function (req, res) {
    res.send("Welcome to home page")
  })