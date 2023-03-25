const mongoose = require('mongoose');
// const DB = process.env.DATABASE;
require('dotenv').config()

mongoose.connect('mongodb+srv://manohar:singhms@cluster0.pmgih.mongodb.net/portfoliyo?retryWrites=true&w=majority').then(()=>{
    console.log(`connection succeed`)
}).catch((err)=>console.log(`no connection`))