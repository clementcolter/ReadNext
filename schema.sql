create table books (
    id int not null auto_increment, 
    book_name text not null,
    image_data BLOB, 
    review_num int default 0, 
    stars int default 0,
    upload_time timestamp,
    author text not null,
    primary key(id)
);

CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);