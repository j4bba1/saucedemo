const { expect } = require('@playwright/test');





exports.ItemBagPage = class ItemBagPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;

      this.itemBagName = page.locator('[data-test="inventory-item-name"]');
      this.itemBagDesc = page.locator('[data-test="inventory-item-desc"]');
      this.itemBagPrice = page.locator('[data-test="inventory-item-price"]');

      this.itemBagAdd = page.locator('[data-test="add-to-cart"]');
      this.itemBagRem = page.locator('[data-test="remove"]');
      this.itemCartIcon = page.locator('[data-test="shopping-cart-link"]');
      this.itemCartBadge = page.locator('//span[@class="shopping_cart_badge"]');
    };
  
    async goto() {
      await this.page.goto('https://www.saucedemo.com/inventory-item.html?id=4');
    };

    async addItemBag() {
      await this.itemBagAdd.click();
      await expect(this.itemBagRem).toBeVisible();
    };

    async remItemBag() {
      await this.itemBagRem.click();
      await expect(this.itemBagAdd).toBeVisible();
    };

    async openItemCart() {
      await this.itemCartIcon.click();
      await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    };
}