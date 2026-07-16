// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { imgObj } from '../objects/imageObjects';
import { usersObj } from '../objects/loginObjects';
import { passwordsObj } from '../objects/loginObjects';
import { productInfo } from '../objects/productInfoArr';

// Authentication and Login (14 Test Cases)

test.describe('Successfull login', ()=> {
  const invImg = '/assets/sl-404-Cq1a9k9X.jpg'


  // go to page
  test.beforeEach('Go to page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  })

  test.skip('TC-008: Successful Logout', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    await loginPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(homePage.usernamenIn).toBeVisible();
    await expect(homePage.passwordIn).toBeVisible();
    await expect(homePage.loginBtn).toBeVisible();
  });

  test('TC-001: Successful Login with Valid User', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem;

    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container and is visible
    await expect(child).toHaveCount(1);
    await expect(loginPage.shopCart).toBeVisible();

    // check items img is okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i])
    };
  });

  test('TC-009: Session Stays Active During Navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem;

    await homePage.login(usersObj.standardUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container and is visible
    await expect(child).toHaveCount(1);
    await expect(loginPage.shopCart).toBeVisible();
    await expect(loginPage.shopCart).toHaveText('');

    // check items img is okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i])
    };


    // click on item and add it to cart
    await page.getByText(productInfo.bagName).click();

    await expect(productPage.img).toHaveAttribute('src', imgObj.bagImg);
    await expect(productPage.name).toHaveText(productInfo.bagName);
    await expect(productPage.desc).toHaveText(productInfo.bagDesc);
    await expect(productPage.price).toContainText(productInfo.bagPrice);

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

    // go back to iventory page
    await cartPage.continueShop();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // check items img is okay
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i])
    };

    await expect(loginPage.shopCart).toHaveText('1');
  });

  test('TC-010: Login with Problem User', async ({ page }) => {
    // user has wrong item pictures
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem
    
    await homePage.login(usersObj.problemUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is not okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', invImg);
    };
  });

  test('TC-011: Login with Performance User', async ({ page }) => {
    // login takes more time
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem

    await homePage.login(usersObj.glitchUser, passwordsObj.pw);
    //await shopCart.waitFor({ state: 'visible', timeout: 10});
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);
  
    // check items img is okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i])
    };
  });

  test('TC-extra-001 Login with Error User', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem
    
    
    await homePage.login(usersObj.errorUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is okay
    const values = Object.values(imgObj);
    for( let i = 0; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i]);
    };
  });

  test('TC-extra-002 Login with Visual User', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const parent = page.locator('//div[@class="shopping_cart_container visual_failure"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem;
    
    await homePage.login(usersObj.visualUser, passwordsObj.pw);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // shopping card icon is in wrong postion
    await expect(child).toHaveCount(1);

    // first image is not okay
    await expect(item.nth(0).locator('//img')).toHaveAttribute('src', invImg);

    // rest of images are okay
    const values = Object.values(imgObj);
    for( let i = 1; i < values.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', values[i]);
    };
  });

});

test.describe('Unsuccessfull login', () => {
  // go to page
  test.beforeEach('Go to page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  });

  test.afterEach('User stayed on login page', async ({ page }) => {
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  });
  
  test('TC-002: Login with Invalid Username', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username and password do not match any user in this service';

    await homePage.login(usersObj.invUsername, passwordsObj.pw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    
    await expect(homePage.usernamenIn).toBeEnabled();
    await expect(homePage.passwordIn).toBeEnabled();
    await expect(homePage.loginBtn).toBeEnabled();
  });

  test('TC-003: Login with Invalid Password', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username and password do not match any user in this service';

    await homePage.login(usersObj.standardUser, passwordsObj.invPw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    
    await expect(homePage.usernamenIn).toBeEnabled();
    await expect(homePage.usernamenIn).toHaveValue(usersObj.standardUser)
    await expect(homePage.passwordIn).toBeEnabled();
    await expect(homePage.loginBtn).toBeEnabled();
  });

  test('TC-004: Login with Locked Out User', async ({ page }) => {
    const homePage = new HomePage(page);

    const errorTxt = 'Epic sadface: Sorry, this user has been locked out.';

    await homePage.login(usersObj.lockedUser, passwordsObj.pw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
  });

  test('TC-005: Login with Empty Username', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username is required'

    await homePage.login(usersObj.emptyUsername, passwordsObj.pw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    await expect(homePage.usernamenIn).toHaveValue(usersObj.emptyUsername);
    await expect(homePage.passwordIn).toHaveValue(passwordsObj.pw);
  });

  test('TC-006: Login with Empty Password', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Password is required'

    await homePage.login(usersObj.standardUser, passwordsObj.emptyPw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    await expect(homePage.usernamenIn).toHaveValue(usersObj.standardUser);
  });

  test('TC-007: Login with Both Fields Empty', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username is required'

    await homePage.login(usersObj.emptyUsername, passwordsObj.emptyPw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    await expect(homePage.usernamenIn).toHaveValue(usersObj.emptyUsername);
    await expect(homePage.passwordIn).toHaveValue(passwordsObj.emptyPw);
  });

  test('TC-012: Error Message Can Be Dismissed', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username and password do not match any user in this service';

    await homePage.login(usersObj.invUsername, passwordsObj.pw);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
    await homePage.closeErrorMsg();
    await expect(homePage.errorMsg).not.toBeVisible();
    
    await expect(homePage.usernamenIn).toBeEnabled();
    await expect(homePage.passwordIn).toBeEnabled();
    await expect(homePage.loginBtn).toBeEnabled();
  });
}) ;