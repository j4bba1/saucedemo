const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@id="user-name"]');
    this.passwordInput =  page.locator('//input[@id="password"]');
    this.loginButton = page.locator('//input[@id="login-button"]');
  }

  async login(username, password) {
    await this.page.goto('https://www.saucedemo.com/');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

