// @ts-check
import { test, expect } from '@playwright/test';
import { InventoryPage } from '../POM/inventory.page';

test('POM interacting with inventory items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    //OPEN LINK WITH THE ITEM BAG
    //await inventoryPage.openItemBag();
    await inventoryPage.addItemBag();
    await inventoryPage.remItemBag();

});

