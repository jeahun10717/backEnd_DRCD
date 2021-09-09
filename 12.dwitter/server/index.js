const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const tweets = require('./tweet')

const PORT = 8080;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

router.use('/tweets', tweets);
app.use('/', router);



app.listen(8080, ()=>{
    console.log(`now server(port: ${PORT}) is running ... `);
});