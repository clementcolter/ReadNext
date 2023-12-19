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

async function uploadBook(binary, bookname, author, upload_time){
    const query = "INSERT INTO books (image_data, book_name, author, upload_time) VALUES (?, ?, ?, ?)";
    const ls = bookname.split('.')
    const param = [binary, ls[0], author, upload_time];
    return await connPool.awaitQuery(query, param);
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
module.exports = {uploadBook, getNewestBooks, registerAccount}