import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { OverviewPage } from '../pages/overviewPage';
import { CompletePage } from '../pages/completePage';
import { imgObj } from '../objects/imageObjects';
import { usersObj } from '../objects/loginObjects';
import { passwords } from '../objects/loginObjects';
import { productInfo } from '../objects/productInfoArr';

const taxPrice = '2.40'
const totalPrice = '32.39'

const firstName = 'First'
const lastName = 'Last'
const zipCode = '123 45'

const filterNameAZ = 'Name (A to Z)';
const filterNameZA = 'Name (Z to A)';
const filterPriceLH = 'Price (low to high)';
const filterPriceHL = 'Price (high to low)';

test.beforeEach('TC10) Successfull login with "standard_user"', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
    
    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem

    await homePage.login(usersObj.standardUser, passwords.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i]);
    };
});

test('TC11) buy item "Sauce Labs Backpack"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkPage = new CheckoutPage(page);
    const overPage = new OverviewPage(page);
    const completePage = new CompletePage(page);

    // click on first item
    await loginPage.invetoryItem.first().locator('//div[@class="inventory_item_name "]').click();

    // check item page info
    await expect(productPage.img).toHaveAttribute('src', imgObj.bagImg);
    await expect(productPage.name).toHaveText(productInfo.bagName);
    await expect(productPage.desc).toHaveText(productInfo.bagDesc);
    await expect(productPage.price).toContainText(productInfo.bagPrice);

    // add item
    await productPage.addProduct();
    await expect(productPage.removeBtn).toBeVisible();
    await expect(productPage.cartIcon).toHaveText('1');

    // cart page
    await productPage.cartIcon.click();
    await expect(cartPage.Qty).toHaveText('1');
    await expect(cartPage.name).toHaveText(productInfo.bagName);
    await expect(cartPage.desc).toHaveText(productInfo.bagDesc);
    await expect(cartPage.price).toContainText(productInfo.bagPrice);
    await expect(cartPage.removeBtn).toBeVisible();
    await expect(cartPage.cartIcon).toHaveText('1');
    await cartPage.checkout();

    // checkout page
    await checkPage.fill(firstName, lastName, zipCode);
    await expect(checkPage.firstNameIn).toHaveValue(firstName);
    await expect(checkPage.lastNameIn).toHaveValue(lastName);
    await expect(checkPage.zipCodeIn).toHaveValue(zipCode);
    await expect(checkPage.shopCart).toHaveText('1');
    await checkPage.continue();

    // overview page
    await expect(overPage.Qty).toHaveText('1');
    await expect(overPage.name).toHaveText(productInfo.bagName);
    await expect(overPage.desc).toHaveText(productInfo.bagDesc);
    await expect(overPage.subPrice).toContainText(productInfo.bagPrice);
    await expect(overPage.taxPrice).toContainText(taxPrice);
    await expect(overPage.totalPrice).toContainText(totalPrice);
    await expect(overPage.shopCart).toHaveText('1');
    await overPage.finish();

    // download
    const waitForDownloadEvent = page.waitForEvent('download');
    await completePage.downloadPdf();
    const download = await waitForDownloadEvent;
    await download.saveAs('../test-result' + download.suggestedFilename());

    // go to home page
    await completePage.homePage();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('TC12) products fitlers A to Z', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const item = await loginPage.invetoryItem;

    await loginPage.filter(filterNameZA);

    // check result by items img
    const values = Object.values(imgObj);
    var iback = values.length - 1;
    for(let i = 0; i < values.length; i++) {
        await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[iback])
        iback -= 1;
    };
});

test('TC13) products filter Low to High', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const priceArr = [];
    const item = await loginPage.invetoryItem;
    const itemCount = await item.count();

    await loginPage.filter(filterPriceLH);

    for(let i = 0; i < itemCount; i++) {
        let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
        let priceSlice = priceEl.slice(1);
        let price = Number(priceSlice);
        priceArr.push(price);
    };

    for(let i = 1; i < priceArr.length; i++) {
        await expect(priceArr[i]).toBeGreaterThanOrEqual(priceArr[i - 1]);
    };
});

test('TC14) products filter High to Low', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const priceArr = [];
    const item = await loginPage.invetoryItem;
    const itemCount = await item.count();

    await loginPage.filter(filterPriceHL);

    for(let i = 0; i < itemCount; i++) {
        let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
        let priceSlice = priceEl.slice(1);
        let price = Number(priceSlice);
        priceArr.push(price);
    };

    for(let i = 1; i < priceArr.length; i++) {
        await expect(priceArr[i]).toBeLessThanOrEqual(priceArr[i - 1]);
    };
});

test('TC15) add and remove item from Inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // item number
    const itemNum = 1;

    const item = await loginPage.invetoryItem;
    const addFirstBtn =  await item.nth(itemNum-1).locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
    const removeFirstBtn = await item.nth(itemNum-1).locator('//button[@class="btn btn_secondary btn_small btn_inventory "]'); 

    // add first item from invetory
    await addFirstBtn.click();
    await expect(loginPage.shopCart).toHaveText('1');
    await expect(removeFirstBtn).toBeVisible();

    // remove first item from inventory
    await removeFirstBtn.click();
    await expect(addFirstBtn).toBeVisible();
    await expect(loginPage.shopCart).toHaveText('');
});

test('TC16) add and remove item from Product page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    // item number
    // const itemNum = 1;

    // click on first item
    // const item = await loginPage.invetoryItem;
    // const addFirstBtn =  await item.nth(itemNum-1).locator('//div[@class="inventory_item_name "]').click();
    await page.getByText(productInfo.bagName).click();

    // check item page info
    await expect(productPage.img).toHaveAttribute('src', imgObj.bagImg);
    await expect(productPage.name).toHaveText(productInfo.bagName);
    await expect(productPage.desc).toHaveText(productInfo.bagDesc);
    await expect(productPage.price).toContainText(productInfo.bagPrice);
});
