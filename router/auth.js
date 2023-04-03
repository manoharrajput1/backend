const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require('../db/conn');
const User = require('../models/schema');

// router.get('/',(req,res)=>{
//     res.send('hello server world')
// });
router.post('/signup', async (req,res)=>{

    const { name, email, phone, work, file, password, cpassword } = req.body;
    // console.log(req.body);

    if (!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"please fillup the correct property"});
    }

    try {
        const userExist = await User.findOne({email:email});
        if (userExist){
            return res.json({error:"email already registered"})
        }else if(password != cpassword){
            return res.status(422).json({error:"password mismached"});
        }else{ 
        const user = new User({ name, email, phone, work, file, password, cpassword});

        await user.save();

        res.json('go to signin page')
        }
  
    }catch (err) {
        console.log(err);
    }

});

router.post('/signin',async (req,res)=>{
    try {
        const {email, password}  = req.body;
        if(!email || !password) {
            return res.status(400).json({error:"please fill the data"})
        }
        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);
        const isMatch = await bcrypt.compare(password, userLogin.password);
        // console.log(isMatch);
        if(isMatch){
            const token = await userLogin.generateAuthToken();

            console.log(token);

            res.cookie('jwtoken',token,{expires:new Date(Date.now() + 2555500000),httpOnly:true, secure:true});

            if(!isMatch){
                res.status(400).json({error:"invalid details"})
            }else{
                res.json('go to home page')
            }
        }else{
            res.status(400).json({error:"invalid details"})
        }
    } catch (err) {
        console.log(err);
    }
});
router.get('/about', authenticate ,(req,res)=>{
    console.log('about page');
    res.send(req.rootUser);
});
router.get('/getdata', authenticate ,(req,res)=>{
    console.log('getdata');
    res.send(req.rootUser);
});
router.post('/contact', authenticate , async(req,res)=>{
    try {
        const {name, email, phone, message} = req.body;

        if (!name || !email || !phone || !message){
            console.log('error in contact');
            return res.json({error:'fill correct data'});
        }

        const userContact = await User.findOne({_id:req.userID});

        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);

            await userContact.save();
            res.status(201).json({message:'succeed'});
        }

    } catch (error) {
        console.log(error);
    }

});

router.get('/logout',(req,res)=>{
    console.log('logout');
    res.clearCookie('jwtoken' ,{path:'/'});
    res.status(201).send('User Logged Out');
});

module.exports = router;
