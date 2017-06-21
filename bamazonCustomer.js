var mysql = require ("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "RutBud17",
	database: "camazon_db"
});

connection.connect(function(error) {
	if (error) throw error;
	// console.log("connected as id " + connection.threadId);
});

connection.query("select * from products", function(error, results){
	if(error) throw error;
	else{
			console.log("We have the following products for sale");
		for(i=0; i<results.length; i++){
			console.log("Product ID - " + results[i].id);
			console.log("Product - " + results[i].product_name + " Price - $" + results[i].price.toFixed(2));
			console.log("-----------------------------");
		}
		doYouWantToBuy();
	}
});



// Ask if the user wants to buy anything
function doYouWantToBuy(){
        inquirer.prompt([
            {
                name: "id",
                message: "If you'd like to buy something, enter the id of that product"
            },
            {
                name: "quantity",
                message: "How many would you like to buy?" 
            },
		]).then(function(answers) {
			// var tempItem = answers;
			checkStock(answers);

		});
};


function checkStock(itemToCheck){
	var query = "SELECT * FROM products WHERE id=?";
	connection.query(query, [itemToCheck.id], function(error, results){
		var stockItem = results; 
		console.log("You selected " + stockItem[0].product_name + " to buy");
		if (results.stock_Quantity < itemToCheck.quantity) {
			console.log("We're sorry we don't have enough in stock to fill your order")
		} else {
			console.log("Thank you for your order, we're processing it now");
			executePurchase(itemToCheck, stockItem);
		}

	});
}

function executePurchase(itemToPurchase, itemInStock){
	var totalPurchasePrice = itemInStock[0].price * itemToPurchase.quantity;
	var newQuantity = itemInStock[0].stock_Quantity - itemToPurchase.quantity;
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
			stock_Quantity: newQuantity
		}, {
			id: itemToPurchase.id
		}], function(error, results) {
			if(error) throw error;
			else{
				console.log("Your purchase was sucessful");
				console.log("Your total cost was - $" + totalPurchasePrice.toFixed(2));
				showUpdatedItem(itemToPurchase);
			}
	});

}

function showUpdatedItem(currentItem){
	var query = "SELECT * FROM products WHERE id=?";
	connection.query(query, [currentItem.id], function(error, results){
		if(error) throw error;
		else{
			console.log(results)
		}	
	})
}
