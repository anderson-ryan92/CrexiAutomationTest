import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { faker } from '@faker-js/faker';
import { PropertiesPage } from '../pages/PropertiesPage';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

test('user can signup', async ({ page }) => {

  // Generate random credentials
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();

  console.log(`Generated Email: ${randomEmail}`);
  console.log(`Generated Password: ${randomPassword}`);

  const homePage = new HomePage(page);

  await page.goto('https://crexi.com');

  await homePage.loginOrSignupButton.click();

  await homePage.firstNameField.fill('Ryan');

  await homePage.lastNameField.fill('Anderson');

  await page.fill('input[name="email"]', randomEmail);

  await page.fill('input[name="password"]', randomPassword);

  await homePage.dropdownSelect.click();

  await page.getByTestId('dropdownItem-Other').click();

  await homePage.phoneNumberField.fill('4803997792');

  await homePage.signupButton.click();

  await page.waitForSelector('text=Signup successful');

});


test('user can login', async ({ page }) => {

    const username = process.env.USERNAME!;
    const password = process.env.PASSWORD!;

    const homePage = new HomePage(page);

    await page.goto('https://crexi.com');
  
    await homePage.loginOrSignupButton.click();

    await homePage.loginTab.click();

    await page.pause();

    await homePage.emailField.fill(username);

    await homePage.passwordField.fill(password);

    await homePage.loginButton.click();

    await expect(page.getByTestId('icon-Messages')).toBeVisible();
    
  });


  test('Profile Update: Users can update their profile picture', async ({ page }) => {

    const homePage = new HomePage(page);

    await page.goto('https://crexi.com');

    await homePage.login('anderson.ryan1992@gmail.com', 'Crexcrex99!!');

    await page.goto('https://www.crexi.com/dashboard/profile');
  
    await page.getByTestId('userAvatar').click();

    await page.getByTestId('fileUploader-avatar').getByRole('textbox', { name: 'Click to upload your photo' }).click();

    await page.getByTestId('fileUploader-avatar').getByRole('textbox', { name: 'Click to upload your photo' }).setInputFiles('/Users/ryananderson/Desktop/BW16238-1-0022.jpg');

    await page.getByRole('button', { name: 'Update' }).click();

    await page.getByTestId('notification').isVisible();

    await expect(page.getByText('Your personal info has been updated.')).toBeVisible();

  });


  test('Property Details: Users can click on a property to view its details.', async ({ page, context }) => {

    const homePage = new HomePage(page);

    const pagePromise = context.waitForEvent('page');

    const propertiesPage = new PropertiesPage(page);

    await page.goto('https://crexi.com');

    await homePage.mainSearchBox.fill('Los Angeles');

    await page.getByRole('button', { name: 'Search' }).click();

    const tileResults =  propertiesPage.propertyTile;
    const firstTile = tileResults.nth(0);

    await firstTile.click();

    const newPage = await pagePromise;

    await newPage.waitForTimeout(3000);

    await expect(newPage.locator('div[class="property-info-data"] > crx-sales-attributes')).toBeVisible();

  });

  test('Search: Users can search for properties based on different criteria', async ({ page, context }) => {

    const propertiesPage = new PropertiesPage(page);

    await page.goto('https://www.crexi.com/properties');

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

