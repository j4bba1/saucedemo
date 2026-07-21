class CartPage {
    constructor(page) {
        this.page = page;
        this.Qty = page.locator('[data-test="item-quantity"]');
        this.name = page.locator('[data-test="inventory-item-name"]');
        this.desc = page.locator('[data-test="inventory-item-desc"]');
        this.price = page.locator('[data-test="inventory-item-price"]');

        this.removeBtn = page.locator('//button[@class="btn btn_secondary btn_small cart_button"]');
        this.conBtn = page.locator('[data-test="continue-shopping"]');
        this.checkoutBtn = page.locator('[data-test="checkout"]');

        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    };

    async checkout(){
        await this.checkoutBtn.click();
    };

    async continueShop(){
        await this.conBtn.click();
    };
};

export { CartPage };