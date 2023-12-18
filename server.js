const express = require('express')
const app = express()
const port = 8080
const data = require('./data.js')
const session = require('express-session');
const fs = require('fs')
const path = require('path');

app.set("views", "templates");
app.set("view engine", "pug");
app.use(express.static('resources'));
app.use('/images', express.static('resources/images'));
app.use('/js', express.static("resources/js"));
app.use(express.json());

app.get('/', (req, res) =>{
    data.getNewestBooks().then(response =>{
        const books = response.map((row) => ({
            id: row.id,
            book_name: row.book_name,
            image_data: Buffer.from(row.image_data).toString('base64'),
            stars: row.stars,
            reviews: row.review_num
          }));

        res.render('mainpage.pug', {books})
    })
    
})

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