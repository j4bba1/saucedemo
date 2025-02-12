# Test cases
**LOGIN PAGE**
 
 1. Test successful login with valid username and password
 -	name: Test valid login
	- login with valid username and password
	- check if the login was successful

 2. Test login with invalid username
- name: Test invalid login
	 - login with invalid username/password
	 - login fail, check for error message
  
**INVENTORY PAGE** 

3. Add item "Sauce Labs Backpack" to cart from inventory
- name: Add item "Sauce Labs Backpack" - inventory
   - add selected item to cart from inventory page
   - check if the button was clicked (the button changed from "Add" to "Remove"
   - check if the cart badge changed to 1

4. Remove item "Sauce Labs Backpack" from cart from inventory
- name: Remove item "Sauce Labs Backpack" - inventory
   - remove selected item from cart from inventory page
   - check if the button was clicked (the button changed from "Remove" to "Add")
   - check if the cart badge is not visible

**ITEM PAGE**
5. Add item "Sauce Labs Backpack" to cart from item page
- name: Add item "Sauce Labs Backpack" - item
	- add selected item to card form item page
	- save the item name, description and price in to a variables "bagName", "bagDesc", "bagPrice"
	- console log the variables
	- check if the button was clicked (the button changed from "Add" to "Remove")
	- check if the cart badge changed to 1