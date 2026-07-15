class HomePage {
    constructor(page) {
        this.page = page;
        this.usernamenIn = page.locator('//input[@id="user-name"]');
        this.passwordIn = page.locator('//input[@id="password"]');
        this.loginBtn = page.locator('//input[@id="login-button"]');

        this.errorMsg = page.locator('//h3[@data-test="error"]');
        this.standardUser = page.locator('//div[@id="login_credentials"]')
    };

    async login(username, passoword) {
        await this.usernamenIn.fill(username);
        await this.passwordIn.fill(passoword);
        await this.loginBtn.click();
    };
};

export { HomePage };