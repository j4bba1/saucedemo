class OverviewPage{
    constructor(page) {
        this.page = page;
        this.Qty = page.locator('[data-test="item-quantity"]');
        this.name = page.locator('[data-test="inventory-item-name"]');
        this.desc = page.locator('[data-test="inventory-item-desc"]');
        this.price = page.locator('[data-test="inventory-item-price"]');      
        
        this.payCard = page.locator('[data-test="payment-info-value"]');
        this.shipInfo = page.locator('[data-test="shipping-info-value"]');
        this.subPrice = page.locator('[data-test="subtotal-label"]');
        this.taxPrice = page.locator('[data-test="tax-label"]');
        this.totalPrice = page.locator('[data-test="total-label"]');

        this.shopCart = page.locator('[data-test="shopping-cart-link"]');

        this.finishBtn = page.locator('[data-test="finish"]');
        this.cancelBtn = page.locator('[data-test="cancel"]');
    };

    async finish() {
        await this.finishBtn.click();
    };
};

export { OverviewPage };