class LoginPage {
    constructor(page) {
        this.page = page;
        this.allItmesLink = page.locator('//a[@id="inventory_sidebar_link"]');
        this.aboutLink = page.locator('//a[@id="about_sidebar_link"]');
        this.logoutLink = page.locator('//a[@id="logout_sidebar_link"]');
        this.resetLink = page.locator('//a[@id="reset_sidebar_link"]');

        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.invetoryItem = page.locator('//div[@class="inventory_item"]');
        this.menuBtn = page.getByRole('button', { name: 'Open Menu' });
        this.closeMenuBtn = page.getByRole('button', { name: 'Close Menu' });
    
        this.filterSort = page.locator('[data-test="product-sort-container"]');

    };

    async logout() {
        await this.menuBtn.click();
        await this.logoutLink.waitFor();
        await this.logoutLink.click();
    }

    async filter(option) {
        await this.filterSort.selectOption(option);
    };

};

export { LoginPage };