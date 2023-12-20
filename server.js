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
    secret: 'dkjfabfskdjfbasdslakhdfkajhsdjkhlakjdasdfasdkljasdfkjhmndfmnadbd',
    resave: false,
    saveUninitialized: true
}));

let daily_quote = {}

data.getDailyQuote().then(response =>{
    daily_quote = response[0];
})

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

        const isLoggedIn = req.session && req.session.user;
        user = ""
        if(isLoggedIn){
            user = req.session.user;
        }
        res.render('mainpage.pug', {books, isLoggedIn, user, daily_quote})
    })
    
})

app.get('/book', (req, res) =>{
    data.getBookDetails(req.query.name, req.query.auth).then(response => {
        let title = req.query.name.split('.');
        title = title[0];
        auth = req.query.auth
        let book_data = response[0];
        response[0].image_data = Buffer.from(response[0].image_data).toString('base64');
        
        res.render('book.pug', {book_data, title, auth})
    })
    
})

app.get('/account', (req, res) =>{

})

app.get('/login', (req, res) =>{
    res.render('login.pug');
})

app.get('/signup', (req, res)=>{
    res.render('signup.pug');
})

app.get('/signupsuccess', (req, res) =>{
    res.render('success.pug');
})

app.get('/signupfailure', (req, res) =>{
    res.render('failure.pug');
})

app.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        } else {
          res.redirect('/');
        }
      });
})

app.post('/endpoint/login', async (req, res) =>{
    await verifyCredentials(req.body).then(result =>{
        if(result == true){
            req.session.user = req.body.username;
            res.redirect('/');
        }else{
            // Failure page
        }
    });
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

app.post('/endpoint/comment', (req, res) =>{
    
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

async function verifyCredentials(body){
    return new Promise((resolve, reject) => {
        data.getAccount(body.username).then(response => {
          if (response.length === 1) {
            const storedHash = response[0].password_hash;
            
            bcrypt.compare(body.password, storedHash, (err, result) => {
              if (err) {
                console.error('Error comparing passwords:', err);
                reject(err);
              } else if (result) {
                console.log('Authentication successful');
                resolve(true);
              } else {
                console.log('Authentication failed');
                resolve(false);
              }
            });
          } else {
            // No user found
            resolve(false);
          }
        }).catch(err => {
          console.error('Error fetching user account:', err);
          reject(err);
        });
      });
}

function quoteUploader(quoteList){
    // Exmaple quote list
    // const bookQuotes = [
    //     { quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", author: "Jane Austen", book: "Pride and Prejudice" },
    //     { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", book: "Steve Jobs" },];
    for(let i = 0; i < bookQuotes.length; i++){
        data.uploadQuote(bookQuotes[i].quote, bookQuotes[i].author, bookQuotes[i].book);
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