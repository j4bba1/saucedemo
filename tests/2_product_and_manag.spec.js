// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { usersObj } from '../objects/loginObjects';
import { passwordsObj } from '../objects/loginObjects';
import { pImgObj } from '../objects/productsObj';
import { pNameObj } from '../objects/productsObj';
import { pDescObj } from '../objects/productsObj';
import { pPriceObj } from '../objects/productsObj';

// Product Catalog Management (10 Test Cases)
test.beforeEach('Login with standart user', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');

    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('TC-013: Display Product Inventory', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const imgVals = Object.values(pImgObj);
  const nameVals = Object.values(pNameObj);
  const descVals = Object.values(pDescObj);
  const priceVals = Object.values(pPriceObj);

  const item = await loginPage.invetoryItem;

  // check number of products
  const itemCount = await item.count();
  expect(itemCount).toBe(6);

  // check items info
  for( let i = 0; i < imgVals.length; i++ ) {
    await expect(item.nth(i).locator('//img')).toBeVisible();
    await expect(item.nth(i).locator('//img')).toHaveAttribute('src', imgVals[i]);
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toHaveText(nameVals[i]);
    await expect(item.nth(i).locator('//div[@class="inventory_item_desc"]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_desc"]')).toHaveText(descVals[i]);
    await expect(item.nth(i).locator('//div[@class="inventory_item_price"]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_price"]')).toHaveText(priceVals[i]);
  };
});

test('TC-014: Product Detail View', async ({ page }) => {
  const productPage = new ProductPage(page);

  await page.getByText(pNameObj.bagName).click();
  // check if product info is visible
  await expect(productPage.img).toBeVisible()
  await expect(productPage.name).toBeVisible();
  await expect(productPage.desc).toBeVisible();
  await expect(productPage.price).toBeVisible();

  // check if product info contain correct values
  await expect(productPage.img).toHaveAttribute('src', pImgObj.bagImg);
  await expect(productPage.name).toHaveText(pNameObj.bagName);
  await expect(productPage.desc).toHaveText(pDescObj.bagDesc);
  await expect(productPage.price).toHaveText(pPriceObj.bagPrice);

  // check img size
  const imgSize = await productPage.img.boundingBox();
  expect(Math.round(imgSize.width)).toBe(408);
  expect(Math.round(imgSize.height)).toBe(617);

  // add btn works
  await expect(productPage.addBtn).toBeVisible();
  await productPage.addBtn.click()
  await expect(productPage.cartIcon).toHaveText('1');
  await expect(productPage.removeBtn).toBeVisible();
  await productPage.removeBtn.click();
  await expect(productPage.addBtn).toBeVisible();
  await expect(productPage.cartIcon).toHaveText('');

  // back to products is available
  await expect(productPage.backBtn).toBeVisible();
});

test('TC-015: Sort Products by Name (A to Z)', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const item = await loginPage.invetoryItem;
  const values = Object.values(pNameObj);

  // check if sorting az is preselected by default
  await expect(loginPage.filterSort).toHaveValue('az');

  // check order by product names
  for( let i = 0; i < values.length ; i++) {
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toHaveText(values[i]);
  };
});

test('TC-016: Sort Products by Name (Z to A)', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const filterOpt = 'Name (Z to A)'
  const item = await loginPage.invetoryItem;
  const values = Object.values(pNameObj);

  var iback = values.length - 1;

  // select za sorting
  await loginPage.filter(filterOpt);
  await expect(loginPage.filterSort).toHaveValue('za');

  // check order by product names
  for( let i = 0; i < values.length ; i++) {
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toHaveText(values[iback]);
    iback -= 1;
  };
});

test('TC-017: Sort Products by Price (Low to High)', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const priceArr = [];
  const filterOpt = 'Price (low to high)';
  const item = await loginPage.invetoryItem;
  const values = Object.values(pPriceObj);

  // select low to high sorting
  await loginPage.filter(filterOpt);
  await expect(loginPage.filterSort).toHaveValue('lohi');

  // check order by product prices
  for(let i = 0; i < values.length; i++) {
      let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
      let priceSlice = priceEl.slice(1);
      let price = Number(priceSlice);
      priceArr.push(price);
  };

  for(let i = 1; i < priceArr.length; i++) {
    expect(priceArr[i]).toBeGreaterThanOrEqual(priceArr[i - 1]);
  };
});

test('TC-018: Sort Products by Price (Low to High)', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const priceArr = [];
  const filterOpt = 'Price (high to low)';
  const item = await loginPage.invetoryItem;
  const values = Object.values(pPriceObj);

  // select high o low sorting
  await loginPage.filter(filterOpt);
  await expect(loginPage.filterSort).toHaveValue('hilo');

  // check order by product prices
  for(let i = 0; i < values.length; i++) {
      let priceEl = await item.nth(i).locator('//div[@class="inventory_item_price"]').textContent();
      let priceSlice = priceEl.slice(1);
      let price = Number(priceSlice);
      priceArr.push(price);
  };

  for(let i = 1; i < priceArr.length; i++) {
    expect(priceArr[i]).toBeLessThanOrEqual(priceArr[i - 1]);
  };
});

test('TC-019: Product Information Consistency', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);

  const item = await loginPage.invetoryItem;

  // check backpack info on inventory page
  await expect(item.nth(0).locator('//img')).toHaveAttribute('src', pImgObj.bagImg);
  await expect(item.nth(0).locator('//div[@class="inventory_item_name "]')).toHaveText(pNameObj.bagName);
  await expect(item.nth(0).locator('//div[@class="inventory_item_desc"]')).toHaveText(pDescObj.bagDesc);
  await expect(item.nth(0).locator('//div[@class="inventory_item_price"]')).toHaveText(pPriceObj.bagPrice);

  // check backpack info on product page
  await item.nth(0).locator('//div[@class="inventory_item_name "]').click();
  await expect(productPage.img).toHaveAttribute('src', pImgObj.bagImg);
  await expect(productPage.name).toHaveText(pNameObj.bagName);
  await expect(productPage.desc).toHaveText(pDescObj.bagDesc);
  await expect(productPage.price).toHaveText(pPriceObj.bagPrice);

  // check again backpack info on inventory page
  await productPage.backToProds();
  await expect(item.nth(0).locator('//img')).toHaveAttribute('src', pImgObj.bagImg);
  await expect(item.nth(0).locator('//div[@class="inventory_item_name "]')).toHaveText(pNameObj.bagName);
  await expect(item.nth(0).locator('//div[@class="inventory_item_desc"]')).toHaveText(pDescObj.bagDesc);
  await expect(item.nth(0).locator('//div[@class="inventory_item_price"]')).toHaveText(pPriceObj.bagPrice);
});

test('TC-020: Navigation Menu Access', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.menuBtn.click();
  await expect(loginPage.allItmesLink).toBeVisible();
  await expect(loginPage.aboutLink).toBeVisible();
  await expect(loginPage.logoutLink).toBeVisible();
  await expect(loginPage.resetLink).toBeVisible();
  await expect(loginPage.allItmesLink).toBeEnabled();
  await expect(loginPage.aboutLink).toBeEnabled();
  await expect(loginPage.logoutLink).toBeEnabled();
  await expect(loginPage.resetLink).toBeEnabled();

  await loginPage.closeMenuBtn.click();
  await expect(loginPage.allItmesLink).not.toBeVisible();
  await expect(loginPage.aboutLink).not.toBeVisible();
  await expect(loginPage.logoutLink).not.toBeVisible();
  await expect(loginPage.resetLink).not.toBeVisible();
});

test('TC-021: Back to Products Navigation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);

  const filterOpt = 'Name (Z to A)'
  const item = await loginPage.invetoryItem;
  const values = Object.values(pNameObj);

  var iback = values.length - 1;

  // select za sorting
  await loginPage.filter(filterOpt);
  await expect(loginPage.filterSort).toHaveValue('za');

  // check order by product names
  for( let i = 0; i < values.length ; i++) {
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toHaveText(values[iback]);
    iback -= 1;
  };

  await page.getByText(pNameObj.bagName).click();
  await productPage.backToProds();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(loginPage.filterSort).toHaveValue('az');

  for( let i = 0; i < values.length ; i++) {
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toBeVisible();
    await expect(item.nth(i).locator('//div[@class="inventory_item_name "]')).toHaveText(values[i]);
  };
});

test('TC-022: Product Images Load Correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const imgVals = Object.values(pImgObj);
  const item = await loginPage.invetoryItem; 
  const imgExpWidth = 159;
  const imgExpHeight = 239;

  // check number of products
  const itemCount = await item.count();
  expect(itemCount).toBe(6);

  // check images
  for( let i = 0; i < imgVals.length; i++ ) {
    await expect(item.nth(i).locator('//img')).toBeVisible();
    await expect(item.nth(i).locator('//img')).toHaveAttribute('src', imgVals[i]);
    let imgSize = await item.nth(i).locator('//img').boundingBox();
    expect(Math.round(imgSize.width)).toBe(imgExpWidth);
    expect(Math.round(imgSize.height)).toBe(imgExpHeight);
  };
});