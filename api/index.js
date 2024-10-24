const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);    // to create hash of the registered password
const secret = 'asdfasdfqe2343asdfdasd';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://farswangolu:XvV2JeI9157pk41E@cluster0.ofjnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const connection = mongoose.connection;
connection.on("error", (e) => {
    console.log(e);
})
connection.once("open" , () => console.log("connencted to mongoose"))
// console.log(connection)


// app.get('/api', async(req,res) => {
//     res.send({
//         name: "Golu",
//         age: "Byah Ki"
//     })
// })
 

// Route to create new user
app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt)
            });
        res.json(userDoc);

    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req,res) =>{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        //logged in 
        jwt.sign({username, id:userDoc._id}, secret, {} , (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
        
    }
    else{
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile',(req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
    res.json(req.cookies);
});

app.post('/logout',(req,res) => {
    res.cookie('token', '').json('ok');
})


app.listen(4000);
// XvV2JeI9157pk41E

//mongodb+srv://farswangolu:<db_password>@cluster0.ofjnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
