USE bamazon;

CREATE TABLE departments (
	department_id VARCHAR(10) NOT NULL PRIMARY KEY,
	department_name VARCHAR(50) NULL,
	over_head_costs DECIMAL(10.2) NULL
);
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Electronics");
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Games");
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Home");
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Computers");
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Phones");
INSERT INTO `bamazon`.`departments`
(`department_name`)
VALUES ("Music");
