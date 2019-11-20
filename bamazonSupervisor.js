const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const mysql = require("mysql");
var colors = require('colors');



// CONNECT TO DB
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "11.08Tt&Bb",
    database: "bamazon"
})

// ESTABLISH A CONNECTION TO THE DATABASE
connection.connect(function (err, response){
    if (err) {console.log(err.message);}
    //console.log("CONNECTED!");
    chooseOption();
})

// ASK FOR USER INPUT FOR:
// View Product Sales by Department  
// Create New Department

