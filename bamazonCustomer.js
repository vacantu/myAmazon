const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const mysql = require("mysql");
const shell = require('shelljs');
const colors = require('colors');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// DEFINE GLOBAL VARIABLES
// Array of products to store the products object
var arrProducts = [];
equalDiv = "=";

// CONNECT TO DB
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: process.env.MYSQL_PASSWORD, // IT'S NOT WORKING WITH .env
    database: "bamazon"
})
console.log
// ESTABLISH A CONNECTION TO THE DATABASE
connection.connect(function (err, response){
    if (err) {console.log(err.message);}
    clear();
    console.log(
        chalk.yellow(
          figlet.textSync('bAmazon Customer', { horizontalLayout: 'default' })
        )
      );
    chooseDep();
})

// DISPLAY DEPARTMENTS FIRST, THEN WHEN THE CUSTOMER CHOOSES ONE, DISPLAY PRODUCTS AVAILABLE IN THAT DEPARTMENT.
function chooseDep(){
    connection.query("SELECT department_name FROM departments",function(err,res){
        if (err) throw err;
        else{
            var arrDepts = [];
            if(res){
                for(var i = 0;i<res.length;i++){
                    arrDepts.push(res[i].department_name);
                    //console.log("ARRAY & OBJ: ", arrDepts, deptsObj);
                }
                inquirer.prompt([{
                    name:"depChoice",
                    type:"list",
                    choices:arrDepts,
                    message:"what department are you interested in?"
                }]).then(function(result){
                    //console.log("RAW RESULT: ", result);
                    var selectedDep = result.depChoice;
                    chooseProd(selectedDep);
                })
            }
        }
    }) // CLOSES CALLBACK FUNCTION AND QUERY
} // CLOSES FUNCTION

function chooseProd(selectedDep){
    var arrProds = [];
    arrProducts = []; // INITIALIZE THIS ARRAY
    // QUERY PRODUCTS AVAILABLE IN THE CHOOSEN DEPARTMENT
    connection.query('SELECT sku,product,price,stock_quantity FROM products WHERE department = ?',[selectedDep],
        function(err,res){ 
            if (err) throw err;
            arrProds =[]; // LOCAL ARRAY VARIABLE TO STORE PRODUCT CHOICES
            if(res) {
                var prodsObj = {};
                for(var i = 0;i<res.length;i++){
                    prodsObj[res[i].sku]=res[i].stock_quantity;
                    arrProducts.push(prodsObj);
                    var dbRawPrice = res[i].price;
                    var dbEditedPrice = "$"+res[i].price.toLocaleString();
                    arrProds.push(res[i].sku+":"+res[i].product+" @ $"+res[i].price.toLocaleString());
                }
                inquirer.prompt([
                {
                    name:"prodChoice",
                    type:"list",
                    choices:arrProds,
                    message:"Select any of the " + i + " products in this department:"
                },
                {
                    name:"inputQty",
                    message:"How many do you need?"
                },
                {
                    name:"nickName",
                    message:"Please provide your nickname to id your order:"
                }]).then(function(result){
                    var selectedProd = result.prodChoice;
                    var selectedSKU = selectedProd.substr(0,7);
                    for (var i=0;i<arrProducts.length; i++) {
                        var obj = arrProducts[i];
                        let dbSKU = Object.keys(obj)[i];
                        let dbStock = Object.values(obj)[i];
                        if(dbSKU===selectedSKU) {
                            if (dbStock - result.inputQty >0) {
                                processOrder(result.nickName,dbSKU,result.inputQty,dbRawPrice,selectedProd);
                            } else {
                                lowStock(result.inputQty,dbStock,selectedDep);
                            }
                        }
                    }
                })
            }
        } // END OF CALL BACK FUNCTION
    ) // END OF QUERY
} // END OF chooseProduct FUNCTION

// Process the selected product:
// Check availability; Add it to orders TABLE.
function processOrder(nickName,dbSKU,inputQty,dbRawPrice,selectedProd) {
    processMsg = "Thank you,"+nickName+",let me process your order for "+inputQty+" "+selectedProd;
    process.stdout.write('\033c'); // CLEARS THE SCREEN
    console.log(processMsg.green);
    console.log(equalDiv.repeat(processMsg.length).green);
    var thisSale = inputQty * dbRawPrice;
    console.log("ventas: ",thisSale);
    connection.query('UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE sku = ?',[inputQty,thisSale,dbSKU], function (error, result) {
        if (error) throw error;
        process.stdout.write('\033c'); // CLEARS THE SCREEN
        let totalOrder = dbRawPrice * inputQty;
        let confirmMsg = "Your order has beeen processed, for a total of $"+ totalOrder.toLocaleString() +" Please keep on buying.";
        console.log(confirmMsg.green);
        console.log(equalDiv.repeat(confirmMsg.length).green);
        chooseDep();
      });
}
function lowStock(qtyRequired,qtyAvailable,selectedDep) {
    process.stdout.write('\033c'); // CLEARS THE SCREEN
    let inRed = "Sorry, we can not fulfill your order for "+qtyRequired+" we only have "+qtyAvailable+ " available.";
    console.log(inRed.red);
    console.log(equalDiv.repeat(inRed.length).red);
    chooseProd(selectedDep);
}