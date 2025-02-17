const { expect } = require('@playwright/test');
const exp = require('node:constants');

exports.InventoryPage = class InventoryPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.inventoryCartBadge = page.locator('//span[@class="shopping_cart_badge"]')
    this.inventoryBag = page.locator('[data-test="item-4-title-link"]');
    this.inventoryBagAdd = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.inventoryBagRem = page.locator('[data-test="remove-sauce-labs-backpack"]');

    this.inventorySortButton = page.locator('[data-test="product-sort-container"]');
    this.SortButtonActiveOption = page.locator('//span[@class="active_option"]')
    this.firstItem = page.locator('//div[@class="inventory_item_description"]').nth(0)

    this.openMenu = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  // interacting with the item Backpack
  async openItemBag() {
    await this.inventoryBag.click();
  };

  async addItemBag() {
    await this.inventoryBagAdd.click();
    await expect(this.inventoryBagRem).toBeVisible();
  };

  async remItemBag() {
    await this.inventoryBagRem.click();
    await expect(this.inventoryBagAdd).toBeVisible();
  };

  async logout() {
    await this.openMenu.click()
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  };

  async sortZtoA() {
    await this.inventorySortButton.selectOption('Name (Z to A)');
    await expect(this.SortButtonActiveOption).toHaveText('Name (Z to A)');
    await expect(this.firstItem).toContainText('Test.allTheThings() T-Shirt (Red)');
  };

  async sortLowToHigh() {
    await this.inventorySortButton.selectOption('Price (low to high)');
    await expect(this.SortButtonActiveOption).toHaveText('Price (low to high)');
    await expect(this.firstItem).toContainText('Sauce Labs Onesie');
    await expect(this.firstItem).toContainText('$7.99');
  };

  async sortHightToLow() {
    await this.inventorySortButton.selectOption('Price (high to low)');
    await expect(this.SortButtonActiveOption).toHaveText('Price (high to low)');
    await expect(this.firstItem).toContainText('Sauce Labs Fleece Jacket');
    await expect(this.firstItem).toContainText('$49.99');
  };
}
