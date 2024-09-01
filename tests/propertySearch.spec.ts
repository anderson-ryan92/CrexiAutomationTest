import { test, expect } from '@playwright/test';
import { PropertiesPage } from '../pages/PropertiesPage';
import { HomePage } from '../pages/HomePage';
import { PropertyDetailPage } from '../pages/PropertyDetailPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

// filtering properties by price
test('Search: Users can search for properties based on different criteria - filter on price)', async ({ page, context }) => {

    await page.goto('/properties');

    const propertiesPage = new PropertiesPage(page);

    await propertiesPage.anyPriceDropdown.click();

    await expect(propertiesPage.priceBox).toBeVisible();

    await propertiesPage.minValueInput.fill('2000000');

    await propertiesPage.excludeUnpricecListingsCheckbox.click();

    const responsePromise = page.waitForResponse('**/api.crexi.com/assets/search');

    await propertiesPage.applyButton.click();

    // wait for a network response after the button click
    const response = await responsePromise;

    // click X on pop up
    await page.getByRole('button', { name: '' }).click();

    const propertyPrices = await page.locator('span[data-cy="propertyPrice"]');

    const count = await propertyPrices.count();

    // Loop through each element and assert that the price is greater than 2,000,000
    for (let i = 0; i < count; i++) {
        // Get the text content of the current element
        const priceText = await propertyPrices.nth(i).textContent();
        
        // Convert the text to a number
        const price = parseFloat(priceText?.replace(/[^0-9.-]+/g, '') || '0');
        
        // Assert that the price is greater than 2,000,000
        expect(price).toBeGreaterThanOrEqual(2000000);
    }

  });

  // this test navigates to the homepage, enters "Roger Phillips" into the seach bar,
  // clicks on the first property tile, and verifies that brokes name is listed for that property
  test('Search: Users can search for properties based on different criteria - broker / agent)', async ({ page, context }) => {

    const homePage = new HomePage(page);
    const pagePromise = context.waitForEvent('page');
    homePage.mainSearchBox.fill('Roger Phillips')
    homePage.searchButton.click();
    const propertiesPage = new PropertiesPage(page);
    propertiesPage.propertyTile.first().click();
    const newPage = await pagePromise;
    // waiting for the new tab to load
    await newPage.waitForTimeout(2000);
    const propertyDetailsPage = new PropertyDetailPage(newPage);
    const listingContacts = await propertyDetailsPage.listingContactsNames.allInnerTexts();
    expect(listingContacts.some(name => name.includes('Roger Phillips'))).toBeTruthy();

  });