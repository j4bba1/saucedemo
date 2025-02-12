import { test, expect } from '@playwright/test';
import { InventoryPage } from '../POM/inventory.page';
import { LoginPage } from '../POM/login.page';
import exp from 'node:constants';
import { CartPage } from '../POM/cart.page';

let itemName = '';
let itemDesc = '';
let itemPrice = '';


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

test('Add item "Sauce Labs Backpack" - inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    //adding item
    await inventoryPage.goto();
    await inventoryPage.addItemBag();
    let cartBadgeVal = await inventoryPage.cartBadge.textContent();
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
    await expect(inventoryPage.cartBadge).not.toBeVisible();
})



//itemName = await page.locator('[data-test="item-4-title-link"]').textContent();

//await cartPage.goto();
//await cartPage.checkVars(itemName);