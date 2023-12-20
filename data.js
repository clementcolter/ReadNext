const mysql = require(`mysql-await`); // npm install mysql-await

var connPool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "",
  password: "", 
  authPlugins: {
    mysql_native_password: 'mysql_native_password',
  }
});

async function getAccount(username){
    const query = "SELECT password_hash, salt FROM accounts WHERE username= ?";
    const param = [username];
    return await connPool.awaitQuery(query, param);
}

async function uploadBook(binary, bookname, author, upload_time){
    const query = "INSERT INTO books (image_data, book_name, author, upload_time) VALUES (?, ?, ?, ?)";
    const ls = bookname.split('.')
    const param = [binary, ls[0], author, upload_time];
    return await connPool.awaitQuery(query, param);
}

async function uploadQuote(quote, author="Unknown", bookname = "Unknown"){
    const query = "INSERT INTO quotes (quote, author, book) VALUES (?, ?, ?)";
    const param = [quote, author, bookname];
    return await connPool.awaitQuery(query, param);
}

async function getBookDetails(book, author){
    const query = "SELECT review_num, stars, image_data FROM books WHERE book_name = ? AND author = ?"
    const params = [book, author];
    return await connPool.awaitQuery(query, params);
}

async function getDailyQuote(){
    const query = "SELECT * FROM quotes ORDER BY RAND() LIMIT 1";
    return await connPool.awaitQuery(query);
}
async function getNewestBooks(){
    // Later use timestamp to get the literal latest 
    const query = "SELECT * FROM books ORDER BY upload_time DESC LIMIT 10;"
    return await connPool.awaitQuery(query);
}

async function registerAccount(username, password, salt){
    const query = "INSERT INTO accounts (username, password_hash, salt) VALUES (?,?,?)"
    const params = [username, password, salt];
    return await connPool.awaitQuery(query, params);
}
module.exports = {uploadBook, uploadQuote, getNewestBooks, registerAccount, getAccount, getDailyQuote, getBookDetails}