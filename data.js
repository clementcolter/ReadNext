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

async function uploadBook(binary, bookname){
    const query = "INSERT INTO books (image_data, book_name) VALUES (?, ?)";
    const ls = bookname.split('.')
    const param = [binary, ls[0]];
    return await connPool.awaitQuery(query, param);
}

async function getNewestBooks(){
    // Later use timestamp to get the literal latest 
    const query = "SELECT * FROM books;"
    return await connPool.awaitQuery(query);
}
module.exports = {uploadBook, getNewestBooks}