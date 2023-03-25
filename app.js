const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const User = require('./models/schema');
require('dotenv').config()

require('./db/conn');
app.use(cookieParser())

app.use(cors({
    origin: '*',
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use(require('./router/auth'))

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})