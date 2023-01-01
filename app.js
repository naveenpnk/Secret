//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

/////////////////////////////////////////////// Creating User Database //////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/UserDB',{useNewUrlParser: true}, (err) => {
    if (!err) {
        console.log("Database is connected successfully...")
    }else{
        console.log(err);
    }
})
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY,encryptedFields:['password']})
const User = new mongoose.model('User', userSchema);

////////////////////////////////////////////// Routing for User Auth /////////////////////////////////////////////////////
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//  Route for Home
app.route(['/','/home'])

.get((req,res) => {
    res.render('home');
})

//  Route for Register

app.route('/register')
.get((req,res) => {
    res.render('register');
})
.post((req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: email,
        password: password
    })
    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render('secrets')
        }
    })
})

//  Route for Login

app.route('/login')
.get((req,res) => {
    res.render('login');
})
.post((req,res) => {
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email: userEmail}, (err,foundUser) => {
        if (!err) {
            if (foundUser) {
                if(foundUser.password === userPassword){
                    res.render('secrets')
                }
            } else {
                console.log("Invalid Username or Password!")
            }
        } else {
            console.log(err)
        }
    })
})


app.listen(5000, () => {
    console.log("Server started listening in port 5000")
})