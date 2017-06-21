var mysql = require ("mysql");
var inquirer = require("inquirer");

// CRUD - Create, Read, Update, Deete
// C insert into tablename(colums) values ()
// R select * from tablename where
// U update tablename set fieldname = ? shere ?
// D delete from tablename where 


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

promptWhatToDo();

function promptWhatToDo(){
inquirer.prompt([{
	type: "list",
	name: "toDo",
	message: "What would you like to do?",
	choices: [
		"View Products for Sale",
		"View Low Inventory",
		"Add to Inventory",
		"Add New Product"
		]
	}]).then(function(answers) {
		console.log("Answers - " + answers.toDo);
		switch (answers.toDo){
			case "View Products for Sale":
				viewAllProducts()
			break;
			case "View Low Inventory":
				viewLowInventory()
			break;
			case "Add to Inventory":
				addToInventory()
			break;
			case "Add New Product":
				addItemToInventory()
			break;
		}
	});
// prompt what to do
};


function viewAllProducts(){
	connection.query("select * from products", function(error, results){
		if(error) throw error;
		else{
			for(i=0; i<results.length; i++){
				console.log("Product - " + results[i].product_name);
				console.log("Department - " + results[i].department_name);
				console.log("Price - $" + results[i].price.toFixed(2));
				console.log("Quantity in Stock - " + results[i].stock_Quantity)
			}
		promptWhatToDo()
		}
	});
// end view all products
};


function viewLowInventory(){
	var query = "SELECT product_name, stock_Quantity FROM products WHERE stock_Quantity < 5";
	connection.query(query, function(error, results){
		if (error) throw error;
		else
			console.log("the following proucts have low inventory:")
			for (i=0; i<results.length; i++){
				console.log(results[i].product_name + "   has   " + results[i].stock_Quantity + " in stock")
			}
		promptWhatToDo()
	})
// end view low inventory
}

function addToInventory(){
	connection.query("select * from products", function(error, results){
		if(error) throw error;
		else{
			var productList = [];
			for(i=0; i<results.length; i++){
				// console.log("Product - " + results[i].product_name);
				productList.push({
					name: results[i].product_name,
					value: results[i].id
				});
			};
			inquirer.prompt([{
				type: 'list',
				name: 'itemToAdd',
				message: 'To what product would you like to add inventory?',
				choices: productList
				}
			]).then(function(answers) {
				var indexIntoProducts = answers.itemToAdd -1;
				inquirer.prompt([{
		                name: "numOfItems",
		                message: "How many " + productList[indexIntoProducts].name + "s would you like to add?"
					}
				]).then(function(secondAnswer) {
					var newquanity = (parseInt(secondAnswer.numOfItems) + parseInt(results[indexIntoProducts].stock_Quantity));
					connection.query("UPDATE products SET ? WHERE ?", [{
							stock_Quantity: newquanity
						}, {
							id: productList[indexIntoProducts].value
						}], function(error, results) {
						    if(error) throw error;
							else {
								console.log("Incremed stock quantity of " + productList[indexIntoProducts].name + " by " + secondAnswer.numOfItems);
							}
						promptWhatToDo()
						}
					);
				// end inner inquirer callback
				});
			// end inquirer callback
			})
		// end else
		}
	// end query
	});
// end add to inventory	
}


// BEGIN THE ENTER NEW PRODUCT SECTION
function addItemToInventory (){
        inquirer.prompt([
            {
                name: "product_name",
                message: "Enter an item name"
            },
            {
                name: "department_name",
                message: "Enter the department that this item is in" 
            },
            {
                name: "price",
                message: "Enter the price of this item"
            },
            {
                name: "stock_Quantity",
                message: "Enter the quantity in stock"
            }
		]).then(function(answers) {
			// var tempItem = answers;
			console.log(answers);
			connection.query("INSERT INTO products SET ?", answers, function(error, results){
				if(error) throw error;
				else{
					viewAllProducts()
				}
				promptWhatToDo()
			});
		});
};
//  END ENTER NEW PRODUCT SECTION










// connection.query("DELETE FROM products WHERE ?", {
// 	product_name: "2x4 Dug Fir"
// } , function(error, results) {});

	// connection.query("select * from music where genre='rock' ", function(error, results){
	// 	if(error) throw error;
	// 	console.log(results);
	// })
	
// connection.query("INSERT INTO products SET ?",{
//     product_name: "20A Dual Outlet",
//     department_name: "Building Materials",
//     price: 1.24,
//     stock_Quantity: 128
// })


// connection.query("INSERT INTO products SET ?",{
// 	flavor: "Rocky Road",
// 	price: 3.00,
// 	Quantity: 50
// }, function(error, results)
// });

// connection.query("UPDATE music SET ? WHERE ?", [{
// 	genre: "Rock"
// }, {
// 	genre: "rock"
// }], function(error, results) {});




// }])


// connection.query("select * from products", function(error, results){
// 	if(error) throw error;
// 	else{
// 		for(i=0; i<results.length; i++){
// 			console.log("Product - " + results[i].product_name);
// 			console.log("Department - " + results[i].department_name);
// 			console.log("Price - $" + results[i].price.toFixed(2));
// 			console.log("Quantity in Stock - " + results[i].stock_Quantity)
// 		}
// 	}
// });
