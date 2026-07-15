class ProductPage {
    constructor(page) {
        this.page = page;
        this.name = page.locator('[data-test="inventory-item-name"]');
        this.desc = page.locator('[data-test="inventory-item-desc"]');
        this.price = page.locator('[data-test="inventory-item-price"]');
        this.img = page.locator('[data-test="item-sauce-labs-backpack-img"]');

        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');

        this.addBtn = page.locator('[data-test="add-to-cart"]');
        this.removeBtn = page.locator('[data-test="remove"]');
    };

    async addProduct() {
        await this.addBtn.click();
    };
};

export { ProductPage };