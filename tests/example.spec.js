import { test, expect } from '@playwright/test';
import { InventoryPage } from '../POM/inventory.page';
import { LoginPage } from '../POM/login.page';
import exp from 'node:constants';
import { CartPage } from '../POM/cart.page';
import { ItemBagPage } from '../POM/itemBag.page';
import { CheckoutPage } from '../POM/checkout.page';
import { CheckoutOverviewPage } from '../POM/checkoutOverview.page';
import { checkServerIdentity } from 'node:tls';

var itemName = '';
var itemDesc = '';
var itemPrice = '';

test.describe('Testing login with valid/invalid login data. Testing logout.', () => {
    test.beforeEach('Clearing cookies', async ({ page, context }) => {
        await context.clearCookies();
    });

    test('Test valid login', async ({ page, context }) => {
        const username = 'standard_user';
        const password = 'secret_sauce';
        const loginPage = new LoginPage(page);

        await loginPage.login(username,password);
        //check if the login was successfull
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Test invalid login', async ({ page, context }) => {
        const username = 'fail_user';
        const password = 'secret_sauce';
        const loginPage = new LoginPage(page);

        await loginPage.login(username,password);
        //check for the error element
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Test logout', async ({ page, context }) => {
        const username = 'standard_user';
        const password = 'secret_sauce';
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.login(username,password);
        //check if the login was successfull
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
        //log out
        await inventoryPage.logout()
    });
});

test.describe('Adding/removing item "Sauce Labs Backpack" to/from cart - inventory page', () => {
    test.beforeEach('Adding item', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        //adding item
        await inventoryPage.goto();
        await inventoryPage.addItemBag();
    });

    test('Add item "Sauce Labs Backpack" - inventory', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        //checking cart index
        let cartBadgeVal = await inventoryPage.inventoryCartBadge.textContent();
        await expect(cartBadgeVal).toEqual('1');
    });
    
    test('Remove item "Sauce Labs Backpack" - inventory', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        //removing added item
        await inventoryPage.goto();
        await inventoryPage.remItemBag();
        await expect(inventoryPage.inventoryCartBadge).not.toBeVisible();
    });
});

test.describe('Adding/removing item "Sauce Labs Backpack" to/from cart - item page', () => {
    test.beforeEach('Adding item', async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        const inventoryPage = new InventoryPage(page);

        await inventoryPage.goto();
        await inventoryPage.openItemBag();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
        //adding item
        await itemBagPage.addItemBag();
    });

    test('Add item "Sauce Labs Backpack" - item', async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        //checking cart index
        let cartBadgeVal = await itemBagPage.itemCartBadge.textContent();
        await expect(cartBadgeVal).toEqual('1');
    })
    
    test('Remove item "Sauce Labs Backpack" - item', async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        //removing item
        await itemBagPage.remItemBag();
        //checking cart index
        await expect(itemBagPage.itemCartBadge).not.toBeVisible();
    })
});

test.describe('Verification of data in cart page. Removing item "Sauce Labs Backpack" - cart page', () =>{
    test.beforeEach('Adding item to cart', async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        const inventoryPage = new InventoryPage(page);

        await inventoryPage.goto();
        await inventoryPage.openItemBag();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
        //adding item
        await itemBagPage.addItemBag();
        //open cart page
        await itemBagPage.openItemCart();
    });

    test('Verify data from added item "Sauce Labs Backpack" in cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        const itemBagPage = new ItemBagPage(page);
    
        //setting variables from item page
        itemName = await itemBagPage.itemBagName.textContent();
        itemDesc = await itemBagPage.itemBagDesc.textContent();
        itemPrice = await itemBagPage.itemBagPrice.textContent();
        //cheching variables from cart page with variables from item page
        await cartPage.checkVars(itemName, itemDesc, itemPrice);
    });

    test('Remove item "Sauce Labs Backpack" - cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        
        //remove item from cart page
        await cartPage.removeBag();
    });
});

//setting values for the checkout pag
[
    { nameTest: 'empty fistName', firstName: '', lastName: 'Potter', postCode: '123 45', expected: 'Error: First Name is required' },
    { nameTest: 'empty lastName',firstName: 'Harry', lastName: '', postCode: '123 45', expected: 'Error: Last Name is required' },
    { nameTest: 'empty postalCode',firstName: 'Harry', lastName: 'Potter', postCode: '', expected: 'Error: Postal Code is required' },
    { nameTest: 'empty all',firstName: '', lastName: '', postCode: '', expected: 'Error: First Name is required' },
    { nameTest: 'valid data',firstName: 'Harry', lastName: 'Potter', postCode: '123 45', expected: 'https://www.saucedemo.com/checkout-step-two.html' },
].forEach(({ nameTest, firstName, lastName, postCode, expected}) => {
    test(`Filling out the checkout from with ${nameTest}`, async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
    
        await inventoryPage.goto();
        await inventoryPage.openItemBag();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
        //adding item
        await itemBagPage.addItemBag();
        //open cart page
        await itemBagPage.openItemCart();
        //open checkout page;
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')
        //fill checkout form
        await checkoutPage.fillCheckout(firstName, lastName, postCode);

        try {
            await expect(checkoutPage.errorCode).toHaveText(expected);
        } catch (err) {
            await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        };
        
    });
});

test.describe('Verification of data and finishing/cancelling the order  - Checkout: overview page', () =>{
    test.beforeEach('Making the order', async ({ page }) => {
        const itemBagPage = new ItemBagPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        const firstName = 'Harry';
        const lastName = 'Potter';
        const postCode = '123 45';

        await inventoryPage.goto();
        await inventoryPage.openItemBag();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
        //adding item
        await itemBagPage.addItemBag();
        //setting variables from item page
        itemName = await itemBagPage.itemBagName.textContent();
        itemDesc = await itemBagPage.itemBagDesc.textContent();
        itemPrice = await itemBagPage.itemBagPrice.textContent()
        //open cart page
        await itemBagPage.openItemCart();
        //open checkout page
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        //fill checkout form
        await checkoutPage.fillCheckout(firstName, lastName, postCode);
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        // verify data
        await checkoutOverviewPage.verifyData(itemName, itemDesc, itemPrice);
    });

    test('Finish the ordering process', async ({ page }) => {
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        
        //finish the process
        await checkoutOverviewPage.clickFinishButton();
    });

    test('Cancel the ordering process', async ({ page }) => {
        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        //cancel the process
        await checkoutOverviewPage.clickCancelButton();
    });
});