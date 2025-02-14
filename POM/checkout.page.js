const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postCode = page.locator('[data-test="postalCode"]');

    this.errorCode = page.locator('[data-test="error"]');

    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
  };

  async fillCheckout(firstName, lastName, postCode) {
    await expect(this.firstName).toBeVisible();
    await this.firstName.fill(firstName);
    await expect(this.lastName).toBeVisible();
    await this.lastName.fill(lastName);
    await expect(this.postCode).toBeVisible();
    await this.postCode.fill(postCode);

    await this.continueButton.click();
  };
};