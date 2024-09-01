import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { getTestUser } from '../utils/test-utils';

const user = getTestUser(0);
test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('user can login with valid credentials', async ({ page }) => {

    const homePage = new HomePage(page);
    await homePage.login(user.email, user.password);
    await expect(page.getByTestId('icon-Messages')).toBeVisible();
  });

test('user login with incorrect password', async ({ page }) => {

    const homePage = new HomePage(page);
    await homePage.login(user.email, 'wrongpassword');
    await expect(homePage.invalidLogInError.first()).toBeVisible();
  });

test('user login with empty email and password', async ({ page }) => {

    const homePage = new HomePage(page);
    await homePage.login('', '');
    await expect(homePage.emailError.first()).toBeVisible();
    await expect(homePage.loginPasswordError.first()).toBeVisible();
  });

