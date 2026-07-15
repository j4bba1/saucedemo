import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { OverviewPage } from '../pages/overviewPage';
import { CompletePage } from '../pages/completePage';

const standardUser = 'standard_user';
const password = 'secret_sauce';

const bagImg = '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg';
const blightImg = '/assets/bike-light-1200x1500-DxcZRFOA.jpg';
const tshirtImg = '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg';
const jacketImg = '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg';
const onesieImg = '/assets/red-onesie-1200x1500-BrSuq0ic.jpg';
const redImg = '/assets/red-tatt-1200x1500-E-qp6aYf.jpg';

const imgArr = [bagImg, blightImg, tshirtImg, jacketImg, onesieImg, redImg];

const bagName = 'Sauce Labs Backpack'
const bagDesc = 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
const bagPrice = '29.99'
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

    await homePage.login(standardUser, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is okay
    for( let i = 0; i < imgArr.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', imgArr[i])
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
    await expect(productPage.img).toHaveAttribute('src', bagImg);
    await expect(productPage.name).toHaveText(bagName);
    await expect(productPage.desc).toHaveText(bagDesc);
    await expect(productPage.price).toContainText(bagPrice);

    // add item
    await productPage.addProduct();
    await expect(productPage.removeBtn).toBeVisible();
    await expect(productPage.cartIcon).toHaveText('1');

    // cart page
    await productPage.cartIcon.click();
    await expect(cartPage.Qty).toHaveText('1');
    await expect(cartPage.name).toHaveText(bagName);
    await expect(cartPage.desc).toHaveText(bagDesc);
    await expect(cartPage.price).toContainText(bagPrice);
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
    await expect(overPage.name).toHaveText(bagName);
    await expect(overPage.desc).toHaveText(bagDesc);
    await expect(overPage.subPrice).toContainText(bagPrice);
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
    var iback = imgArr.length - 1;
    for(let i = 0; i < imgArr.length; i++) {
        await expect(item.nth(i).locator('//img')).toHaveAttribute('src', imgArr[iback])
        iback -= 1;
    };
});

test('TC)13 products filter Low to High', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const priceArr = [];
    const item = await loginPage.invetoryItem;

    await loginPage.filter(filterPriceLH);

    for(let i = 0; i < imgArr.length; i++) {
        let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
        let priceSlice = priceEl.slice(1);
        let price = Number(priceSlice);
        priceArr.push(price);
    };

    for(let i = 1; i < priceArr.length; i++) {
        await expect(priceArr[i]).toBeGreaterThanOrEqual(priceArr[i - 1]);
    };
});

test('TC)14 products filter High to Low', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const priceArr = [];
    const item = await loginPage.invetoryItem;

    await loginPage.filter(filterPriceHL);

    for(let i = 0; i < imgArr.length; i++) {
        let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
        let priceSlice = priceEl.slice(1);
        let price = Number(priceSlice);
        priceArr.push(price);
    };

    for(let i = 1; i < priceArr.length; i++) {
        await expect(priceArr[i]).toBeLessThanOrEqual(priceArr[i - 1]);
    };
});
