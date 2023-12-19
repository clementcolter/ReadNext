const express = require('express')
const app = express()
const port = 8080
const data = require('./data.js')
const session = require('express-session');
const fs = require('fs')
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set("views", "templates");
app.set("view engine", "pug");
app.use(express.static('resources'));
app.use('/images', express.static('resources/images'));
app.use('/js', express.static("resources/js"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'dkjfabfskdjfbasd',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) =>{
    data.getNewestBooks().then(response =>{
        const books = response.map((row) => ({
            id: row.id,
            book_name: row.book_name,
            image_data: Buffer.from(row.image_data).toString('base64'),
            stars: row.stars,
            reviews: row.review_num,
            author: row.author
        }));

        const isLoggedIn = req.session && req.session.userId;

        res.render('mainpage.pug', {books, isLoggedIn})
    })
    
})

app.get('/login', (req, res) =>{
    
})

app.get('/signup', (req, res)=>{
    res.render('signup.pug');
})

app.get('/signupsuccess', (req, res) =>{
    res.render('success.pug');
})

app.get('/signupfailure', (req, res) =>{
    res.render('failuer.pug');
})

app.post('/endpoint/signup', (req, res)=>{
    const body = req.body; 
    const response = genUser(body);
    if(response){
        res.redirect('/signupsuccess')
    }else{ 
        res.redirect('/signupfailure');
    }
})

async function genUser(body){
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(body.password, salt);
    try{
        data.registerAccount(body.username, passwordHash, salt).then(response =>{
            return true;
        });
    } catch (error){
        return false;
    }
    
}

function fileUploader(){
    fs.readdir("./resources/images/books", (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
      
        // Iterate over the files in the directory
        files.forEach((filename) => {
          const fullPath = path.join("./resources/images/books", filename);
          if (fs.statSync(fullPath).isFile()) {
            // Read the binary data of the file
            const imageBuffer = fs.readFileSync(fullPath);
      
            // Assuming you have a function named 'uploadBook' that handles the database upload
            data.uploadBook(imageBuffer, filename);
          }
        })
    })
}
app.listen (port , () => {
    console.log(`Example app listening on port ${port}`)
  })