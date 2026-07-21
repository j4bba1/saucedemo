// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { OverviewPage } from '../pages/overviewPage';
import { CompletePage } from '../pages/completePage';
import { usersObj } from '../objects/loginObjects';
import { passwordsObj } from '../objects/loginObjects';
import { pNameObj } from '../objects/productsObj';
import { pDescObj } from '../objects/productsObj';
import { pPriceObj } from '../objects/productsObj';
import { checkFromObj } from '../objects/checkoutObjects';
import { checkErrorObj } from '../objects/checkoutObjects';
import { exec } from 'node:child_process';

const itemNum = 3;

test.beforeEach('Login and add products', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    const item = await loginPage.invetoryItem;
    const values = Object.values(pNameObj);

    let cartArray = [];

    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');

    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

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
    await cartPage.checkout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});

test('TC-038: Checkout Process Start', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await expect(checkoutPage.firstNameIn).toBeVisible();
    await expect(checkoutPage.lastNameIn).toBeVisible();
    await expect(checkoutPage.zipCodeIn).toBeVisible();
    await expect(checkoutPage.conBtn).toBeVisible();
    await expect(checkoutPage.cancelBtn).toBeVisible();
});

test('TC-039: Complete Checkout with Valid Information', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.lastName, checkFromObj.zipCode);
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await checkoutPage.continue();

    for (let i = 0; i < itemNum; i++) {
        await expect(overviewPage.Qty.nth(i)).toHaveText('1');
        await expect(overviewPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(overviewPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(overviewPage.price.nth(i)).toHaveText(pValues[i]);
    };
});

test('TC-040: Checkout with Missing First Name', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fill(checkFromObj.emptyFirstName, checkFromObj.lastName, checkFromObj.zipCode);
    await checkoutPage.continue();
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.emptyFirstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    

    await expect(checkoutPage.errorEl).toBeVisible();
    await expect(checkoutPage.errorEl).toHaveText(checkErrorObj.firstNameErr);
});

test('TC-041: Checkout with Missing Last Name', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.emptyLastName, checkFromObj.zipCode);
    await checkoutPage.continue();
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.emptyLastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    

    await expect(checkoutPage.errorEl).toBeVisible();
    await expect(checkoutPage.errorEl).toHaveText(checkErrorObj.lastNameErr);
});

test('TC-042: Checkout with Missing Postal Code', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.lastName, checkFromObj.emptyZipCode);
    await checkoutPage.continue();
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.emptyZipCode);
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    

    await expect(checkoutPage.errorEl).toBeVisible();
    await expect(checkoutPage.errorEl).toHaveText(checkErrorObj.zipErr);
});

test('TC-044: Complete Purchase', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const completePage = new CompletePage(page);

    const tyMsgHeadValue = 'Thank you for your order!';
    const tyMsgTxtValue = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!';

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.lastName, checkFromObj.zipCode);
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await checkoutPage.continue();

    for (let i = 0; i < itemNum; i++) {
        await expect(overviewPage.Qty.nth(i)).toHaveText('1');
        await expect(overviewPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(overviewPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(overviewPage.price.nth(i)).toHaveText(pValues[i]);
    };

    await overviewPage.finish();
    await expect(completePage.tyMsgHead).toBeVisible();
    await expect(completePage.tyMsgTxt).toBeVisible();
    await expect(completePage.tyMsgHead).toHaveText(tyMsgHeadValue);
    await expect(completePage.tyMsgTxt).toHaveText(tyMsgTxtValue);
});

test('TC-045: Cancel Checkout from Information Page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const cartPage = new CartPage(page);

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);
    
    await expect(checkoutPage.firstNameIn).toBeVisible();
    await expect(checkoutPage.lastNameIn).toBeVisible();
    await expect(checkoutPage.zipCodeIn).toBeVisible();
    await expect(checkoutPage.conBtn).toBeVisible();
    await expect(checkoutPage.cancelBtn).toBeVisible();

    await checkoutPage.cancel();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        await expect(cartPage.cartIcon).toHaveText(String(itemNum));

    for (let i = 0; i < itemNum; i++) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(cartPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(cartPage.price.nth(i)).toHaveText(pValues[i]);
        await expect(cartPage.removeBtn.nth(i)).toBeVisible();
    };

    await expect(cartPage.conBtn).toBeEnabled();
    await expect(cartPage.checkoutBtn).toBeEnabled();
});

test('TC-046: Cancel Checkout from Overview Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.lastName, checkFromObj.zipCode);
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await checkoutPage.continue();

    for (let i = 0; i < itemNum; i++) {
        await expect(overviewPage.Qty.nth(i)).toHaveText('1');
        await expect(overviewPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(overviewPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(overviewPage.price.nth(i)).toHaveText(pValues[i]);
    };

    await overviewPage.cancel();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await loginPage.cartIcon.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.cartIcon).toHaveText(String(itemNum));

    for (let i = 0; i < itemNum; i++) {
        await expect(cartPage.Qty.nth(i)).toHaveText('1');
        await expect(cartPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(cartPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(cartPage.price.nth(i)).toHaveText(pValues[i]);
        await expect(cartPage.removeBtn.nth(i)).toBeVisible();
    };

    await expect(cartPage.conBtn).toBeEnabled();
    await expect(cartPage.checkoutBtn).toBeEnabled();
});

test('TC-047: Order Total Calculation Accuracy', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    let priceArr = [];
    let subtotal = 0;

    const nValues = Object.values(pNameObj);
    const dValues = Object.values(pDescObj);
    const pValues = Object.values(pPriceObj);

    await checkoutPage.fill(checkFromObj.firstName, checkFromObj.lastName, checkFromObj.zipCode);
    await expect(checkoutPage.firstNameIn).toHaveValue(checkFromObj.firstName);
    await expect(checkoutPage.lastNameIn).toHaveValue(checkFromObj.lastName);
    await expect(checkoutPage.zipCodeIn).toHaveValue(checkFromObj.zipCode);
    await checkoutPage.continue();


    for (let i = 0; i < itemNum; i++) {
        await expect(overviewPage.Qty.nth(i)).toHaveText('1');
        await expect(overviewPage.name.nth(i)).toHaveText(nValues[i]);
        await expect(overviewPage.desc.nth(i)).toHaveText(dValues[i]);
        await expect(overviewPage.price.nth(i)).toHaveText(pValues[i]);
        let priceEl = await overviewPage.price.nth(i).textContent();
        priceEl = priceEl.replace('$', '');
        let price = Number(priceEl);    
        priceArr.push(price)
    };

    // price elements from oberwiev page
    let subPriceEl = await overviewPage.subPrice.textContent();
    subPriceEl = Number(subPriceEl.replace('Item total: $', ''));
    subPriceEl = Number(subPriceEl.toFixed(2));
    let taxPriceEl = await overviewPage.taxPrice.textContent();
    taxPriceEl =Number(taxPriceEl.replace('Tax: $', ''));
    taxPriceEl = Number(taxPriceEl.toFixed(2));
    let totalPriceEl = await overviewPage.totalPrice.textContent();
    totalPriceEl = Number(totalPriceEl.replace('Total: $', ''));
    totalPriceEl = Number(totalPriceEl.toFixed(2));

    // subtotal of products prices
    subtotal = priceArr.reduce((total, price)=> total + price, 0);
    subtotal = Number(subtotal.toFixed(2));

    // tax price calc
    let taxPrice = subtotal * 0.08;
    taxPrice = Number(taxPrice.toFixed(2));

    // subtotal + tax price
    let totalPrice = subtotal + taxPriceEl;
    totalPrice = Number(totalPrice.toFixed(2));

    expect(subPriceEl).toBe(subtotal);
    expect(taxPriceEl).toBe(taxPrice);
    expect(totalPriceEl).toBe(totalPrice);
});