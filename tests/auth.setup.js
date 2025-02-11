import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

const userName = 'standard_user';
const password = 'secret_sauce';

setup('authenticate', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.locator('//input[@id="user-name"]').fill(userName);
    await page.locator('//input[@id="password"]').fill(password);
    await page.locator('//input[@id="login-button"]').click();

    await expect(page.locator('[data-test="logout-sidebar-link"]')).not.toHaveCount(0);

    await page.context().storageState({ path: authFile });

});