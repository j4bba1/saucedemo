import { test, expect } from '@playwright/test';
import { InventoryPage } from '../POM/inventory.page';
import { LoginPage } from '../POM/login.page';
import exp from 'node:constants';
import { CartPage } from '../POM/cart.page';
import { ItemBagPage } from '../POM/itemBag.page';

let bagName = '';
let bagDesc = '';
let bagPrice = '';


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

test('Cart page check - added item', async ({ page }) => {
    const itemBagPage = new ItemBagPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.goto();
    await inventoryPage.openItemBag();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    //adding item
    await itemBagPage.addItemBag();
    //setting variables
    bagName = await itemBagPage.itemBagName.textContent();
    bagPrice = await itemBagPage.itemBagPrice.textContent();
    bagDesc = await itemBagPage.itemBagDesc.textContent();
    //open cart page
    await itemBagPage.openItemCart();
    //cheching variables from cart and from added item
    let bagCartName = await cartPage.itemNameBag.textContent();
    let bagCartDesc = await cartPage.itemDescBag.textContent();
    let bagCardPrice = await cartPage.itemPriceBag.textContent();

    await expect(bagCartName).toEqual(bagName);
    await expect(bagCartDesc).toEqual(bagDesc);
    await expect(bagCardPrice).toEqual(bagPrice);
});