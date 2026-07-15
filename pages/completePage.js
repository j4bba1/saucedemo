class CompletePage{
    constructor(page) {
        this.page = page;
        this.tyMsg = page.locator('[data-test="complete-header"]');

        this.backBtn = page.locator('[data-test="back-to-products"]');
        this.genPdf = page.locator('[data-test="generate-pdf-order"]');

        this.shopCart = page.locator('[data-test="shopping-cart-link"]');
    };

    async downloadPdf() {
        await this.genPdf.click();
    }

    async homePage() {
        await this.backBtn.click();
    }
}; 

export { CompletePage };