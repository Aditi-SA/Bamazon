//Dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");

//connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    //console.log("connected as id " + connection.threadId);
});

//variable to display the products only at login
var loopCnt = 1;

//1st function to display all products 
function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        //console.log(' ');
        console.log("***************Bamazon***************");
        console.log("*************************************");
        console.log(' ');

        // Display all results of the SELECT statement
        if (loopCnt === 1) {
            console.log("List of all products: \n");
            console.log(results);
        }
        loopCnt++;
        
        inquirer.prompt([{
                name: "Product",
                type: "list",
                message: "What product would you like to purchase from Bamazon?",
                choices: ["Ecobee", "Fire TV Stick", "Dare to lead", "The Reckoning", "Kindle", "Monopoly Fortnite Edition"]
            },
            {
                name: "Quantity",
                type: 'input',
                message: "How many units of the product would you like to purchase?",

                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            //console.log("answer.Product: " + answer.Product);
            //console.log("parseInt(answer.Product): " + parseInt(answer.Product));

            //var itemtoBuy = answer.item_id;
            var itemToBuy;
            //
            for (var i = 0; i < results.length; i++) {
                //if (results[i].item_id === parseInt(answer.Product)) {
                if (results[i].product_name === answer.Product) {
                    itemToBuy = results[i];
                }
            }

            console.log("itemToBuy: " + itemToBuy.product_name);
            // check if stock quantity is sufficient to fulfill the order
            if (itemToBuy.stock_quantity >= parseInt(answer.Quantity)) {
                //Calculate the total price of the purchase
                var TotalCost = parseFloat(itemToBuy.price * parseInt(answer.Quantity));

                //After purchase completion, update the quantity in Products
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: itemToBuy.stock_quantity - parseInt(answer.Quantity)
                        },
                        {
                            item_id: itemToBuy.item_id
                        }
                    ],

                    function (error, result) {
                        if (error) throw err;
                        console.log("--------------------------------------------------");
                        console.log("Congratulations! Your order is succesfully placed!");
                        console.log("Your total is: $" + TotalCost.toFixed(2));
                        console.log("--------------------------------------------------");
                        start();
                    }
                )
            } else {
                console.log("Sorry, This Item is currently out of stock, Please try back later!");
                console.log(' ');
                start();
            }

        })
    })

};
start();