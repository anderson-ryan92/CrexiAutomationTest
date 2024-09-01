import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PropertiesPage } from '../pages/PropertiesPage';
import { PropertyDetailPage } from '../pages/PropertyDetailPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

// this test navigates to the homepage, enters "Los Angeles" into the seach bar,
// clicks on the first property tile, and verifies that the property details are visible
test('Property Details: Users can click on a property to view its details.', async ({ page, context }) => {

    const homePage = new HomePage(page);
    const pagePromise = context.waitForEvent('page');
    const propertiesPage = new PropertiesPage(page);
    await homePage.mainSearchBox.fill('Los Angeles');
    await page.getByRole('button', { name: 'Search' }).click();
    const tileResults =  propertiesPage.propertyTile;
    const firstTile = tileResults.nth(0);
    await firstTile.click();
    const newPage = await pagePromise;
    await page.waitForLoadState('domcontentloaded');
    const propertyDetailPage = new PropertyDetailPage(newPage);
    await expect(propertyDetailPage.detailsSection).toBeVisible();

  });