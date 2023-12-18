create table books (
    id int not null auto_increment, 
    book_name text not null,
    image_data BLOB, 
    review_num int default 0, 
    stars int default 0,
    primary key(id)
);