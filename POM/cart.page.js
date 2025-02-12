const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.itemNameBag = page.locator('[data-test="item-4-title-link"]');
      this.itemDescBag = page.locator('[data-test="inventory-item-desc"]');
      this.itemPriceBag = page.locator('[data-test="inventory-item-price"]');
      this.itemRemoveBag = page.locator('[data-test="remove-sauce-labs-backpack"]');
      
      this.contShopping = page.locator('[data-test="continue-shopping"]');
      this.checkoutButton = page.locator('[data-test="checkout"]');
    }
  
    async goto() {
      await this.page.goto('https://www.saucedemo.com/cart.html');
    }

    async checkVars(itemName) {
      await expect(this.itemNameBag).toHaveText(itemName)
    }


}