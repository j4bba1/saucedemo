# saucedemo
login.spec.js
1) successfull login with:<br>
    TC1) standart user<br>
        - login okay<br>
        - shopping cart is in right container<br>
        - items images are okay<br>

    TC2) problem user<br>
        - login okay
        - shopping cart is in right container<br>
        - items images are NOT okay<br>

    TC3) glitch user<br>
        - login okay but takes more time
        - shopping cart is in right container<br>
        - items images are okay<br>

    TC4) error user<br>
        - login okay
        - shopping cart is in right container<br>
        - items images are okay<br>

    TC5) visual user<br>
        - login okay
        - shopping cart is in wrong container<br>
        - first items image is NOT okay, rest is fine<br>

2) unsuccessfull login with:<br>
    TC6) locked user<br>
        - login NOT okay<br>
        - error message

    TC7) invalid user<br>
        - login NOT okay<br>
        - error message

    TC8) empty username user<br>
        - login NOT okay<br>
        - error message

    TC9) empty password user<br>
        - login NOT okay<br>
        - error message<br>

standard:user.spec.js<br>
3) standart user<br>
    TC10) login with standard user<br>
        - login okay<br>
        - shopping cart is in right container<br>
        - items images are okay<br>
    
    TC11) buy item 'Sauce Labs Backpack'<br>
        - choose item 'Sauce Labs Backpack'<br>
        - check item page<br>
        - add to cart<br>
        - go to cart<br>
        - check info in cart page<br>
        - go to checkout<br>
        - fill in the form<br>
        - check info in Checkout: overview<br>
        - finish the order<br>
        - download the PDF<br>
        - go to home page<br>

    TC12) products fitler A to Z<br>
        - pick filter A to Z<br>
        - check the result<br>

    TC13) products fitler Low to High<br>
        - pick filter Prize Low to High<br>
        - check the result<br>
        
    TC14) products fitler High to Low<br>
        - pick filter Prize High to Low<br>
        - check the result<br>