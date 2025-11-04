const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
// const User = require('./models/User');
// const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfasdfqe2343asdfdasd';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//create mysql connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',      //mysql username
  password: '@Siyaram23',   
  database: 'mern_blog'   //mysql database name
});

// Connect to mysql
db.connect((err) => {
    if(err){
      console.error('Mysql connection error:', err);
    }
    else{
      console.log('Connected to MySQL database');
    }
});




// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, salt);

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashed],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, username });
    }
  );
});


// app.post('/login', async (req,res) => {
//   const {username,password} = req.body;
//   const userDoc = await User.findOne({username});
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
//       if (err) throw err;
//       res.cookie('token', token).json({
//         id:userDoc._id,
//         username,
//       });
//     });
//   } else {
//     res.status(400).json('wrong credentials');
//   }
// });

// app.get('/profile', (req,res) => {
//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

// app.post('/logout', (req,res) => {
//   res.cookie('token', '').json('ok');
// });
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(400).json('User not found');

    const user = results[0];
    const passOk = bcrypt.compareSync(password, user.password);
    if (!passOk) return res.status(400).json('Wrong credentials');

    jwt.sign({ username, id: user.id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({ id: user.id, username });
    });
  });
});

//PROFILE
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// LOGOUT
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

// Create post 
app.post('/post', uploadMiddleware.single('file') ,(req,res) =>{
  const {originalname, path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length -1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) =>{
    if(err) throw err;
    const {title, summary, content} = req.body;
    const author_id = info.id;

    db.query(
      'INSERT INTO posts (title, summary, content, cover, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, summary, content, newPath, author_id],
      (err, result) => {
        if(err) return res.status(500).json(err);
        res.json({ id: result.insertId, title, summary, content, cover: newPath});
      }
    );
  });
});
//Update post 
app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;

    db.query('SELECT * FROM posts WHERE id = ?', [id], (err,results)=> {
      if(err) return res.status(500).json(err);
      if(results.length === 0) return res.status(404).json('Post not found');

      const post = results[0];
      if (post.author_id !== info.id){
        return res.status(403).json("You are not the author");
      }

      db.query(
        'UPDATE posts SET title=?, summary=?, content=?, cover=? WHERE id=?',
        [title, summary, content, newPath || post.cover, id],
        err => {
          if(err) return res.status(500).json(err);
          res.json('Post updated successfully');
        }
      );
    });
  });
});
 
//Get All Posts

app.get('/post', (req, res) => {
  db.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id ORDER BY created_at DESC LIMIT 20',
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
});

//Get Post by id
app.get('/post/:id', (req,res) => {
  const {id} = req.params;
  db.query(
    'SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id=?',
    [id],
    (err, results)=>{
      if(err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json("Post not found");
      res.json(results[0]);
    }
  );
});

//Server
app.listen(4000, () => console.log('Server running on port 4000'));
//
// XvV2JeI9157pk41E

//mongodb+srv://farswangolu:<db_password>@cluster0.ofjnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
