DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR (30) NOT NULL,
department_name VARCHAR (30) NOT NULL,
price DECIMAL (10,2),
stock_quantity INTEGER (10) NOT NULL,
PRIMARY KEY (item_id)
);