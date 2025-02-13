const { expect } = require('@playwright/test');

exports.CheckoutOverviewPage = class CheckoutOverviewPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.finishButton = page.locator('[data-test="finish"]');
      this.cancelButton = page.locator('[data-test="cancel"]');

      this.itemNameBag = page.locator('[data-test="item-4-title-link"]');
      this.itemDescBag = page.getByText('carry.allTheThings() with the');
      this.itemPriceBag = page.locator('[data-test="inventory-item-price"]');
    }
  
    async goto() {
      await this.page.goto('https://www.saucedemo.com/checkout-step-two.html');
    }

    async verifyData(itemName, itemDesc, itemPrice) {
      await expect(this.itemNameBag).toHaveText(itemName);
      await expect(this.itemDescBag).toHaveText(itemDesc);
      await expect(this.itemPriceBag).toHaveText(itemPrice); 
    }

    async clickFinishButton(){
      await this.finishButton.click();
      await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    }
}