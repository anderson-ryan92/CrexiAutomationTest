import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { faker } from '@faker-js/faker';
import { PropertiesPage } from '../pages/PropertiesPage';
import * as dotenv from 'dotenv';
import { ProfilePage } from '../pages/ProfilePage';

dotenv.config(); // Load environment variables from .env file

test('user can signup', async ({ page }) => {

  // Generate random credentials
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName();
  const randomPhoneNumber = faker.string.numeric(10);

  console.log(`Generated Email: ${randomEmail}`);
  console.log(`Generated Password: ${randomPassword}`);
  console.log(`Generated Name: ${randomFirstName} ${randomLastName}`);
  console.log(`Generated Phone: ${randomPhoneNumber}`);

  const homePage = new HomePage(page);

  await page.goto('https://crexi.com');

  await homePage.loginOrSignupButton.click();

  await homePage.firstNameField.fill(randomFirstName);

  await homePage.lastNameField.fill(randomLastName);

  await page.fill('input[name="email"]', randomEmail);

  await page.fill('input[name="password"]', randomPassword);

  await homePage.dropdownSelect.click();

  await page.getByTestId('dropdownItem-Other').click();

  await homePage.phoneNumberField.fill(randomPhoneNumber);

  await homePage.signupButton.click();

  await expect(page.getByText('Signup successful')).toBeVisible({ timeout: 10000 });

});


test('user can login', async ({ page }) => {

    const username = process.env.USERNAME!;
    const password = process.env.PASSWORD!;

    const homePage = new HomePage(page);

    await page.goto('https://crexi.com');
  
    await homePage.loginOrSignupButton.click();

    await homePage.loginTab.click();

    // tried to avoid using hardcoded waits but the test kept failing intermittently without it
    await page.waitForTimeout(3000);

    // used these dynamic waits but the test was still flaky, hence why I used the waitForTimeout method above
    await homePage.emailField.waitFor({ state: 'attached' });
    await homePage.passwordField.waitFor({ state: 'attached' });
    await homePage.emailField.waitFor({ state: 'visible' });
    await homePage.passwordField.waitFor({ state: 'visible' });

    await homePage.emailField.fill(username);

    await homePage.passwordField.fill(password);

    await homePage.loginButton.click();

    await expect(page.getByTestId('icon-Messages')).toBeVisible();
    
  });


  test('Profile Update: Users can update their profile picture', async ({ page }) => {

    const homePage = new HomePage(page);
    const profilePage = new ProfilePage(page);

    await page.goto('https://crexi.com');

    // created a helper login function
    await homePage.login('anderson.ryan1992@gmail.com', 'Crexcrex99!!');

    await page.goto('https://www.crexi.com/dashboard/profile');
  
    await profilePage.changePhotoButton.click();

    await profilePage.fileUploadAvatar.click();

    await profilePage.fileUploadAvatar.setInputFiles('/Users/ryananderson/Desktop/BW16238-1-0022.jpg');

    await profilePage.editInfoUpdateButton.click();

    await profilePage.successNotification.isVisible();

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

