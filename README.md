#bAmazon#
##What the project does:##
This project is a simple online store, with an interface for the customer, and another one for the Manager.

##Why the project is useful##
This app can be replicated and easily taken to the web. It’s designed as a Client-Server app, using node.js and mySQL.

##Users can get started with the project by executing the
Customer interface entering the command *node bamazonCustomer.js* in the bash Terminal (Mac or Windows).

The first screen will be a list of Departments, from where the  user can choose the one he’s interested in.
![Dept List](/images/userDepts.png)

Once a department is chosen, all the available products in that department, will be displayed.
![DProducts by Dept](/images/userProductsByDept.png)

The user can then choose a product to order it, and enter the quantity and identifying himself with a nickname.
![Ordering Pproduct](/images/userOrderingProduct.png)

Once he enters the information required, an order confirmatation will be displayed, and will be able to continue ordering. ![Ordered Product](/images/userOrderedProduct.png)

#Manager Interface#
There's also a MAanager interface where the Manager has access to the following options, bvy executing *bamazonManager.js* in the bash Terminal: ![Manager Interface](/images/managerInterface.png)

By selecting "View Products" a list of all the products availble will be dislayed: ![Products List](/images/managerProductsList.png)

The Manager can also get a list of all the products under 50 units ij stock, by selecting the option "Low Inventory": ![Low Inventory](/images/managerLowInventory.png)

Then, the Manager will be able to add inventory go any product, by selecting the option "Add Inventory": ![Add Inventory](/images/managerAddInventory.png)

The last option is for adding a new product. In this option, th Manager will be asked to provide all the data required and will receive a confirmation with the added product:![Add Inventory](/images/managerAddProduct.png)

#Supervisor Interface#
This interface is ben developed. A drpartemens table has already be created and it's been used in the Customer interface. When finished, i'll be able to generate a list af the sabes by department, along with a total profit, and also, will be able to add new departments.








Where users can get help with your project
Who maintains and contributes to the project