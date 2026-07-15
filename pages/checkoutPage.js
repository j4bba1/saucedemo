class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.firstNameIn = page.locator('[data-test="firstName"]');
        this.lastNameIn = page.locator('[data-test="lastName"]');
        this.zipCodeIn = page.locator('[data-test="postalCode"]');

        this.shopCart = page.locator('[data-test="shopping-cart-link"]');

        this.conBtn = page.locator('[data-test="continue"]');
        this.cancelBtn = page.locator('[data-test="cancel"]');
    };

    async fill(firstName, lastName, zipCode){
        await this.firstNameIn.fill(firstName);
        await this.lastNameIn.fill(lastName);
        await this.zipCodeIn.fill(zipCode);
    };

    async continue() {
        await this.conBtn.click();
    };
};

export { CheckoutPage };