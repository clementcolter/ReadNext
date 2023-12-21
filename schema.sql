create table books (
    id int not null auto_increment, 
    book_name text not null,
    image_data BLOB, 
    review_num int default 0, 
    stars int default 0,
    upload_time timestamp,
    author text not null,
    genre VARCHAR(255),
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

CREATE TABLE quotes (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    quote VARCHAR(255) not null,
    author VARCHAR(255),
    book VARCHAR(255)
);

CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    comment TEXT NOT NULL, 
    posted_by VARCHAR(255),
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    book_id INT NOT NULL
);