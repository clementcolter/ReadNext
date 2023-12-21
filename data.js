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
    const query = "SELECT review_num, stars, books.image_data, books.id, comments.comment, comments.posted_by, DATE_FORMAT(comments.posted_date, '%Y-%m-%d %h:%i %p') AS posted_date, comments.rating FROM books LEFT JOIN comments ON books.id = comments.book_id WHERE book_name = ? AND author = ? "
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

async function addComment(comment, posted_by, book_id, stars){
    stars = parseInt(stars); 
    const query1 = `INSERT INTO comments (comment, posted_by, book_id) VALUES (?, ?, ?);`
    const params1 = [comment, posted_by, book_id];
    const query2 = `
                    UPDATE books 
                    SET 
                        review_num = review_num + 1, 
                        stars = ((stars * (review_num - 1)) + ?) / review_num 
                    WHERE 
                        id = ?;
                    `;
    const params2 = [stars, book_id];
    await connPool.awaitQuery(query1, params1);
    return await connPool.awaitQuery(query2, params2);
}

module.exports = {uploadBook, addComment, uploadQuote, getNewestBooks, registerAccount, getAccount, getDailyQuote, getBookDetails}