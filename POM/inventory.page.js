const { expect } = require('@playwright/test');

exports.InventoryPage = class InventoryPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.cartInd = page.locator('//span[@class="shopping_cart_badge"]');
    this.itemBag = page.locator('[data-test="item-4-title-link"]');
    this.itemBagAdd = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.itemBagRem = page.locator('[data-test="remove-sauce-labs-backpack"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  // interacting with the item Backpack
  async openItemBag() {
    await this.itemBag.click();
  };

  async addItemBag() {
    await this.itemBagAdd.click();
    await expect(this.itemBagRem).toBeVisible();
  };

  async remItemBag() {
    await this.itemBagRem.click();
    await expect(this.itemBagAdd).toBeVisible();
  };
}
