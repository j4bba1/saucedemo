// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';


test.describe('Successfull login', ()=> {
  const standardUser = 'standard_user';
  const problemUser = 'problem_user';
  const glitchUser= 'performance_glitch_user';
  const errorUser = 'error_user';
  const visualUser = 'visual_user';

  const password = 'secret_sauce';

  const bagImg = '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg';
  const blightImg = '/assets/bike-light-1200x1500-DxcZRFOA.jpg';
  const tshirtImg = '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg';
  const jacketImg = '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg';
  const onesieImg = '/assets/red-onesie-1200x1500-BrSuq0ic.jpg';
  const redImg = '/assets/red-tatt-1200x1500-E-qp6aYf.jpg';
  
  const invImg = '/assets/sl-404-Cq1a9k9X.jpg'

  const ImgArr = [bagImg, blightImg, tshirtImg, jacketImg, onesieImg, redImg];

  // go to page
  test.beforeEach('Go to page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  })

  test.skip('Logout', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    await loginPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(homePage.loginBtn).toBeVisible();
  })

  test('Successfull login with "standard_user"', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem

    await homePage.login(standardUser, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is okay
    for( let i = 0; i < ImgArr.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', ImgArr[i])
    };
  });

  test('Successfull login with "problem_user"', async ({ page }) => {
    // user has wrong item pictures
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const parent = page.locator('//div[@class="shopping_cart_container"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');

    const item = await loginPage.invetoryItem
    
    await homePage.login(problemUser, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //is shopping cart icon inside the right container
    await expect(child).toHaveCount(1);

    // check items img is not okay
    for( let i = 0; i < ImgArr.length; i++ ) {
      await expect(item.nth(i).locator('//img')).toHaveAttribute('src', invImg);
    };
  });

  test('Successfull login with "performance_glitch_user"', async ({ page }) => {
    // login takes more time
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    const shopCart = loginPage.shopCart;

    await homePage.login(glitchUser, password);
    await shopCart.waitFor({ state: 'visible', timeout: 10});
    // await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Successfull login with "error_user"', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.login(errorUser, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Successfull login with "visual_user"', async ({ page }) => {
    const homePage = new HomePage(page);

    const parent = page.locator('//div[@class="shopping_cart_container visual_failure"]');
    const child = parent.locator('//a[@class="shopping_cart_link"]');
    
    await homePage.login(visualUser, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // shopping card icon is in wrong postion
    await expect(child).toHaveCount(1)
  });

});

test.describe('Unsuccessfull login', () => {
  const lockedOutUser = 'locked_out_user';
  const invUsername = 'invlaid_user';
  const emptyUsername = ''

  const invPassword = 'InvalidPassword';
  const emptyPassword = '';
  const password = 'secret_sauce';

  // go to page
  test.beforeEach('Go to page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('Invalid login with "locked_out_user"', async ({ page }) => {
    const homePage = new HomePage(page);

    const errorTxt = 'Epic sadface: Sorry, this user has been locked out.';

    await homePage.login(lockedOutUser, password);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
  });

  test('Invalid login', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username and password do not match any user in this service';

    await homePage.login(invUsername, invPassword);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
  });

  test('Empty username', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Username is required'

    await homePage.login(emptyUsername, invPassword);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
  });

  test('Empty password', async ({ page }) => {
    const homePage = new HomePage(page);
    const errorTxt = 'Epic sadface: Password is required'

    await homePage.login(invUsername, emptyPassword);
    await expect(homePage.errorMsg).toBeVisible();
    await expect(homePage.errorMsg).toHaveText(errorTxt);
  });
}) ;