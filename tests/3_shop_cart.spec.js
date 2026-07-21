// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { usersObj } from '../objects/loginObjects';
import { passwordsObj } from '../objects/loginObjects';
import { pNameObj } from '../objects/productsObj';
import { pDescObj } from '../objects/productsObj';
import { pPriceObj } from '../objects/productsObj';

// Shopping Cart Management (15 Test Cases)
test.beforeEach('Login with standart user', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');

    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('TC-023: Add Single Product to Cart from Inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const item = await loginPage.invetoryItem;

    const addBtn = item.nth(0).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
    const removeBtn = item.nth(0).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
    
    // click Add btn
    await expect(loginPage.cartIcon).toHaveText('');
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText('Add to cart');
    await addBtn.click();
    await expect(loginPage.cartIcon).toHaveText('1');
    await expect(removeBtn).toBeVisible();
    await expect(removeBtn).toHaveText('Remove');
});

test('TC-024: Add Single Product to Cart from Product Detail', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    const item = await loginPage.invetoryItem;
    const removeBtn = item.nth(0).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');

    await page.getByText(pNameObj.bagName).click();

    await productPage.addProduct();
    await expect(productPage.cartIcon).toHaveText('1');
    await expect(productPage.removeBtn).toBeVisible();
    await expect(productPage.removeBtn).toHaveText('Remove');

    await productPage.goToCart();
    await expect(cartPage.Qty).toHaveText('1');
    await expect(cartPage.name).toHaveText(pNameObj.bagName);

    await cartPage.name.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    await productPage.backToProds();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(removeBtn).toBeVisible();
    await expect(removeBtn).toHaveText('Remove');
});

test('TC-025: Add Multiple Products to Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const itemNum = 3;
    const item = await loginPage.invetoryItem;
    const values = Object.values(pNameObj);

    let cartArray = [];

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i)
        cartArray.push(string);
    };

    // add 3 products
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[i])
    };

    // check cart page info
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum);
});

test('TC-026: Remove Product from Cart via Inventor', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const item = await loginPage.invetoryItem;

    const addBtn = item.nth(0).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
    const removeBtn = item.nth(0).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');

    // click Add btn
    await expect(loginPage.cartIcon).toHaveText('');
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText('Add to cart');
    await addBtn.click();
    await expect(loginPage.cartIcon).toHaveText('1');
    await expect(removeBtn).toBeVisible();
    await expect(removeBtn).toHaveText('Remove');

    // click Remove btn
    await removeBtn.click();
    await expect(loginPage.cartIcon).toHaveText('');
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText('Add to cart');
});

test('TC-027: View Cart Contents', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const item = await loginPage.invetoryItem;

    const itemNum = 4;
    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    let cartArray = [];

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i)
        cartArray.push(string);
    };

    // add products from inventory page
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[i])
    };

    await loginPage.cartIcon.click();

    for (let i = 0; i < itemNum; i++) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(cartPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(cartPage.price.nth(i)).toHaveText(pValues[i]);

        await expect(cartPage.removeBtn.nth(i)).toBeVisible();
    };
});

test('TC-028: Remove Product from Cart Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const item = await loginPage.invetoryItem;

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    var itemNum = 6; // max value 6
    var cartArray = [''];
    var addInd = 1;
    var nValuesInd = 1;

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i);
        cartArray.push(string);
    };

    // add products from inventory page
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[addInd]);
        addInd += 1;
    };

    await loginPage.cartIcon.click();

    // check cart page info
    for (let i = 0; i < itemNum; i++) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(cartPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(cartPage.price.nth(i)).toHaveText(pValues[i]);

        await expect(cartPage.removeBtn.nth(i)).toBeVisible();
    };

    await expect(cartPage.cartIcon).toHaveText(String(itemNum));

    // remove first product from cart page
    await cartPage.removeBtn.nth(0).click();
    await expect(page.getByText(nValues[0])).not.toBeVisible(); // removed product is not visible

    // check the info of the rest of the products in cart page
    for (let i = 0; i < itemNum - 1; i++) {
        await expect(cartPage.name.nth(i)).toHaveText(nValues[nValuesInd]);
        nValuesInd += 1;
    };
});

test('TC-029: Continue Shopping from Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const itemNum = 3; // max value 5
    const item = await loginPage.invetoryItem;
    const values = Object.values(pNameObj);
    const nextAddBtn = item.nth(itemNum).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');

    let cartArray = [];

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i)
        cartArray.push(string);
    };

    // add itemNum of products
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[i])
    };

    // check cart page info
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum);

    // go back to inventory page
    await cartPage.continueShop();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(loginPage.cartIcon).toHaveText(cartArray[itemNum - 1]);
    await expect(nextAddBtn).toBeEnabled();

    // check cart page info again
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum)

    // go back to inventory page
    await cartPage.continueShop();
});

test('TC-035: Cart State After Logout/Login', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const itemNum = 3;
    const item = await loginPage.invetoryItem;
    const values = Object.values(pNameObj);

    let cartArray = [];

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i)
        cartArray.push(string);
    };

    // add 3 products
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[i])
    };

    // check cart page info
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum);

    // logout from inventory page
    await cartPage.continueShop();
    await loginPage.logout();

    // login back
    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); 
    await expect(loginPage.cartIcon).toHaveText(cartArray[itemNum - 1]);

    // check cart page info
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum);
});

test('TC-036: Add All Products to Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const itemNum = 6;
    const item = await loginPage.invetoryItem;
    const values = Object.values(pNameObj);

    let cartArray = [];

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i)
        cartArray.push(string);
    };

    // add 3 products
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[i])
    };

    // check cart page info
    await loginPage.cartIcon.click();
    for( let i = 0; i < itemNum; i++ ) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(values[i]);
    };
    await expect(cartPage.removeBtn).toHaveCount(itemNum);
});

test('TC-037: Remove All Products from Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const item = await loginPage.invetoryItem;

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    var itemNum = 6;
    var cartArray = [''];
    var addInd = 1;
    var removeInd = itemNum;
    var removeLoop = itemNum - 1;

    for( let i = 1; i < itemNum + 1; i++ ) {
        let string = String(i);
        cartArray.push(string);
    };

    // add products from inventory page
    for( let i = 0; i < itemNum; i++ ) {   
        var addBtn = item.nth(i).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        var removeBtn = item.nth(i).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        
        await addBtn.click();
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toHaveText('Remove');
        await expect(loginPage.cartIcon).toHaveText(cartArray[addInd]);
        addInd += 1;
    };

    await loginPage.cartIcon.click();

    // check cart page info
    for (let i = 0; i < itemNum; i++) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(cartPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(cartPage.price.nth(i)).toHaveText(pValues[i]);

        await expect(cartPage.removeBtn.nth(i)).toBeVisible();
    };

    await expect(cartPage.cartIcon).toHaveText(String(itemNum));

    // remove product from cart page
    for (let i = 0; i < itemNum; i++) {
        await cartPage.removeBtn.nth(0).click();
        removeInd -= 1;
        await expect(cartPage.cartIcon).toHaveText(cartArray[removeInd]);
        await expect(page.getByText(nValues[i])).not.toBeVisible(); // removed product is not visible

        var index = i + 1
        for (let i = 0; i < removeLoop; i++) {
            await expect(cartPage.name.nth(i)).toHaveText(nValues[index]);
            index += 1;
        };

        removeLoop -= 1;
    };

    await expect(cartPage.conBtn).toBeEnabled();
});