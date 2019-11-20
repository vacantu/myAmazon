const inquirer = require("inquirer");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// GLOBAL VARIABLES & CONSTRUCTORS
function Products()
{
    sku = '';
    product = '';
    price = 0;
    stock_quantity = 0;
}


// CONNECT TO DB
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon"
})

// ESTABLISH A CONNECTION TO THE DATABASE
connection.connect(function (err){
    if (err) {console.log(err.message);}
    clear();
    chooseOption();
})

function chooseOption() {
    console.log(
        chalk.yellow(
        figlet.textSync('bAmazon * Manager', { horizontalLayout: 'default' })
        )
    );
    // ====================== INQUIRY ===============================  
    arrChoices = ["View Products","View Low Inventory (<50)","Add to Inventory","Add New Product"];
    inquirer.prompt([{
        name:"yourChoice",
        type:"list",
        choices:arrChoices,
        message:"Please, select an option."
    }]).then(function(result){
        var selectedOption = result.yourChoice;
        //console.log("OPTION: ", selectedOption); 
        switch (selectedOption) {
            case "View Products": 
            // console.log("OPTION: ", selectedOption);    
                viewProducts();
            console.log("view prod selected")
                break;
            case "View Low Inventory (<50)": 
                lowInventory();
                break;
            case "Add to Inventory": 
                addInventory();
                //chooseOption();
                break;
            case "Add New Product": 
                addProduct();
                break;
            default:
                break;
        } // END SWITCH-CASE
        
    }) // END CALL BACK FUNCTION
    //
    //chooseOption();
}

// View Products for Sale:
function viewProducts() {
    arrProducts = []; // INITIALIZE THIS ARRAY
    connection.query('SELECT sku,product,price,stock_quantity FROM products',
        function(err,res){if (err) throw err;
            for(var i = 0;i<res.length;i++) {
                //var dbEditedPrice = "$"+res[i].price.toLocaleString();
                var prodsObj  = new Products;
                prodsObj.sku = res[i].sku;
                prodsObj.product = res[i].product;
                prodsObj.price = res[i].price;
                prodsObj.stock_quantity = res[i].stock_quantity;
                arrProducts.push(prodsObj);           
            }
            clear();
            console.log(
                chalk.yellow(
                  figlet.textSync('Products - List', { horizontalLayout: 'default' })
                )
              );
            console.table(arrProducts);
            chooseOption();
        }) // END OF MYSQL CALL BACK FUNCTION
    
}

// View Low Inventory:
// list all items with an inventory count lower than 50.

function lowInventory() {
    arrProducts = []; // INITIALIZE THIS ARRAY
    // QUERY PRODUCTS WITH stock_quantity < 50
    connection.query('SELECT sku,product,price,stock_quantity FROM products WHERE stock_quantity < 50',
        function(err,res){ 
            if (err) throw err;
            for(var i = 0;i<res.length;i++) {
                //var dbEditedPrice = "$"+res[i].price.toLocaleString();
                var prodsObj  = new Products;
                prodsObj.sku = res[i].sku;
                prodsObj.product = res[i].product;
                prodsObj.price = res[i].price;
                prodsObj.stock_quantity = res[i].stock_quantity;
                arrProducts.push(prodsObj);          
            }
            clear();
            console.log(
                chalk.yellow(
                  figlet.textSync('Low Inventory', { horizontalLayout: 'default' })
                )
              );
            console.table(arrProducts);
            chooseOption();
        }) // END OF QUERY CALL BACK FUNCTION
} // END OF FUNCTION lowInventory()

// Add to Inventory:
// Modifies the stock_available
function addInventory() {
    clear();
    console.log(
        chalk.yellow(
          figlet.textSync('Add - Inventory', { horizontalLayout: 'default' })
        )
      );
      //emitter.setMaxListeners(0);
      inquirer.prompt([
    {
        name:"inputSKU",
        message:"Please provide the SKU you want to update."
    },{
        name:"inputQty",
        type:"number",
        message:"How many units do you want to add?"
    }]
    ).then(function(result){
        var selectedSKU = result.inputSKU;
        var qty = result.inputQty;
        console.log("==> ",selectedSKU,qty);
        // QUERY PRODUCT TO UPDATE SELECTED SKU WITH QUANTITY
        connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE sku = ?',[qty,selectedSKU],
        function(err,res){if (err) throw err;
            if (res) {
                console.log("SKU: ",selectedSKU, "has been updated.");
                chooseOption();
            } // END IF QUERY SUCCESFULL
        }) // END OF QUERY CALL BACK FUNCTION
    })  // END OF INQUIRER CAL BACK FUNCTION
} // END OF FUNCTION addInventory()

// Add New Product:
// Creates a new product.

function addProduct() {
    arrProducts = [];
        console.log(
        chalk.yellow(
        figlet.textSync('New Product', { horizontalLayout: 'default' })
        )
    );
    inquirer.prompt([
        {
            name:"inputSKU",
            message:"Please provide a new SKU."
        },{
            name:"inputProduct",
            message:"Please enter its name."
        },{
            name:"inputDept",
            message:"Please enter its department."
        },{
            name:"inputPrice",
            type:"number",
            message:"Please enter its price."
        },{
            name:"inputStock",
            type:"number",
            message:"Enter the initial stock."
        }]
        ).then(function(result){
            var newSKU = result.inputSKU;
            var newName = result.inputProduct;
            var newDept = result.inputDept;
            var newPrice = result.inputPrice;
            var newStock = result.inputStock;
            var newSales = 0;

            // QUERY PRODUCT TO UPDATE SELECTED SKU WITH QUANTITY
            var sql = "INSERT INTO products (Sku, product, department, price, stock_quantity, product_sales) VALUES(?,?,?,?,?,?)";    
            let inserts = [newSKU,newName,newDept,newPrice,newStock,newSales];
            //console.log(inserts);
            sql = mysql.format(sql, inserts);
            //console.log("SQL: ",sql);
            connection.query(sql, function(err,res) {
                if (err) throw err;
                if (res) {
                    var NewProduct = {
                        sku: '',
                        name: '',
                        department: '',
                        price: 0,
                        stock: 0,
                        sales: 0
                    }
                    NewProduct.sku = result.inputSKU;
                    NewProduct.name = result.inputProduct;
                    NewProduct.department = result.inputDept;
                    NewProduct.price = result.inputPrice;
                    NewProduct.stock = result.inputStock;
                    NewProduct.sales = 0;
                    arrProducts.push(NewProduct);
                    clear();
                    console.log("New product added  with the following properties:");
                    console.table(arrProducts);
                    //console.log(newSKU, "inserted");
                    chooseOption();
                } // END IF QUERY SUCCESFULL
            }) // END OF QUERY CALL BACK FUNCTION
        }) // END OF INQUIRER CAL BACK FUNCTION            
} // END OF addProduct() FUNCTION
