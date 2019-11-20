DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	sku INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product VARCHAR(50) NULL,
	department VARCHAR(50) NULL, 
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL
);

INSERT INTO products (flavor, price, quantity)
VALUES ("vanilla", 2.50, 100);
