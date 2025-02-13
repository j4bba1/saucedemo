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


test('Test valid login', async ({ page, context }) => {
    const username = 'standard_user';
    const password = 'secret_sauce';
    const loginPage = new LoginPage(page);

    await context.clearCookies();
    await loginPage.login(username,password)
    //check if the login was successfull
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Test invalid login', async ({ page, context }) => {
    const username = 'fail_user';
    const password = 'secret_sauce';
    const loginPage = new LoginPage(page);

    await context.clearCookies();
    await context.clearCookies();
    await loginPage.login(username,password)
    //check for the error element
    await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('Test logout', async ({ page, context }) => {
    const username = 'standard_user';
    const password = 'secret_sauce';
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await context.clearCookies();
    await loginPage.login(username,password)
    //check if the login was successfull
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //log out
    await inventoryPage.logout()
});

test('Add item "Sauce Labs Backpack" - inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    //adding item
    await inventoryPage.goto();
    await inventoryPage.addItemBag();
    //checkign cart index
    let cartBadgeVal = await inventoryPage.inventoryCartBadge.textContent();
    await expect(cartBadgeVal).toEqual('1');
});

test('Remove item "Sauce Labs Backpack" - inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    //adding item
    await inventoryPage.goto();
    await inventoryPage.addItemBag();
    //removing added item
    await inventoryPage.goto();
    await inventoryPage.remItemBag();
    await expect(inventoryPage.inventoryCartBadge).not.toBeVisible();
});

test('Add item "Sauce Labs Backpack" - item', async ({ page }) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.openItemBag();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    //adding item
    await itemBagPage.addItemBag();
    //checking cart index
    let cartBadgeVal = await itemBagPage.itemCartBadge.textContent();
    await expect(cartBadgeVal).toEqual('1');
})

test('Remove item "Sauce Labs Backpack" - item', async ({ page }) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.openItemBag();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    //adding item
    await itemBagPage.addItemBag();
    //removing item
    await itemBagPage.remItemBag();
    //checking cart index
    await expect(itemBagPage.itemCartBadge).not.toBeVisible();
})

test('Cart page check - added item "Sauce Labs Backpack"', async ({ page }) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

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
    //cheching variables from cart page with variables from item page
    await cartPage.checkVars(itemName, itemDesc, itemPrice);
});

test('Remove item "Sauce Labs Backpack" from cart page', async ({ page }) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.goto();
    await inventoryPage.openItemBag();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    //adding item
    await itemBagPage.addItemBag();
    //open cart page
    await itemBagPage.openItemCart();
    //remove item from cart page
    await cartPage.removeBag();
});

test('Fill checkout form and click on the "Continue" button', async ({page}) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const firstName = 'Harry';
    const lastName = 'Potter';
    const postCode = '123 45';

    await inventoryPage.goto();
    await inventoryPage.openItemBag();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    //adding item
    await itemBagPage.addItemBag();
    //open cart page
    await itemBagPage.openItemCart();
    //open checkout page
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    //fill checkout form
    await checkoutPage.fillCheckout(firstName, lastName, postCode);
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});

test('Left empty field in the form and check error message', async ({ page }) => {
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
    //open checkout page
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    //fill checkout form - empty first name
    var firstName = '';
    var lastName = 'Potter';
    var postCode = '123 45';
    await checkoutPage.fillCheckout(firstName, lastName, postCode);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    //fill checkout form - empty last name
    firstName = 'Harry';
    lastName = '';
    postCode = '123 45';
    await checkoutPage.fillCheckout(firstName, lastName, postCode);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');

    //fill checkout form - empty post code
    firstName = 'Harry';
    lastName = 'Potter';
    postCode = '';
    await checkoutPage.fillCheckout(firstName, lastName, postCode);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');

    //fill checkout form - all fields empty
    firstName = '';
    lastName = '';
    postCode = '';
    await checkoutPage.fillCheckout(firstName, lastName, postCode);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
});

test('Verify data in checkout overview page and finish the process', async ({ page }) => {
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
    //finish the process
    await checkoutOverviewPage.clickFinishButton();
});