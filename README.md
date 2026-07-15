# saucedemo
login.spec.ts
1) successfull login with:<br>
    a) standart user<br>
        - login okay<br>
        - shopping cart is in right container<br>
        - items images are okay<br>

    b) problem user<br>
        - login okay
        - shopping cart is in right container<br>
        - items images are NOT okay<br>

    c) glitch user<br>
        - login okay but takes more time
        - shopping cart is in right container<br>
        - items images are okay<br>

    d) error user<br>
        - login okay
        - shopping cart is in right container<br>
        - items images are okay<br>

    e) visual user<br>
        - login okay
        - shopping cart is in wrong container<br>
        - first items image is NOT okay, rest is fine<br>

2) unsuccessfull login with:<br>
    a) locked user<br>
        - login NOT okay<br>
        - error message

    a) invalid user<br>
        - login NOT okay<br>
        - error message

    a) empty username user<br>
        - login NOT okay<br>
        - error message

    a) empty password user<br>
        - login NOT okay<br>
        - error message
