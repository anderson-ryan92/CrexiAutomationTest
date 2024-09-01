import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

// marked as skipped so random fake users are not created in prod
// one solution would be to delete the user from the database after the user is created in the "afterTest" method
test.skip('user can signup', async ({ page }) => {

    // when a user signs up for this test, we always want a unique email, and unique phone number

    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();
    const randomPhoneNumber = faker.string.numeric(10);
    const homePage = new HomePage(page);
    await homePage.signup(randomEmail, randomPassword, randomPhoneNumber);
    await expect(page.getByText('Signup successful')).toBeVisible({ timeout: 10000 });
  
  });


  test('Signup for an account with an email that is already registered', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.signup(
      'anderson.ryan1992@gmail.com',
      'testpassword123',
      '3105557777'
    );
    await expect(homePage.invalidRegisterError).toBeVisible();
  });

  test('Verify all mandatory fields', async ({ page }) => {
    const homePage = new HomePage(page);
    homePage.loginOrSignupButton.click();
    homePage.signupButton.click();
    await expect(homePage.firstNameError).toBeVisible();
    await expect(homePage.lastNameError).toBeVisible();
    await expect(homePage.emailError).toBeVisible();
    await expect(homePage.passwordError).toBeVisible();
  });

  test('Verify Invalid Inputs', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.loginOrSignupButton.click();
    await homePage.emailField.click();
    await homePage.emailField.fill('invalidemail');
    await homePage.passwordField.click();
    await homePage.passwordField.fill('lessthan12');
    await homePage.phoneNumberField.click();
    await homePage.phoneNumberField.fill('invalidnumber');
    await homePage.signupButton.click();
    //Verify error messages are visible
    await expect(homePage.validEmailError).toBeVisible();
    await expect(homePage.passwordMinimumCharError).toBeVisible();
    await expect(homePage.validPhoneNumberError).toBeVisible();
  });