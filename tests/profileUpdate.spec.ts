import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { getTestUser } from '../utils/test-utils';

const user = getTestUser(0);


test.beforeEach(async ({ page }) => {

    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.login(user.email, user.password);
  });

test('Profile Update: Users can update their profile picture', async ({ page }) => {

    const profilePage = new ProfilePage(page);
    await page.goto('/dashboard/profile');
    await profilePage.uploadPhoto('./test-assests/crexi-pic.jpg');
    await profilePage.successNotification.isVisible();
    await expect(page.getByText('Your personal info has been updated.')).toBeVisible();
  });


  /*
    this test logs in and attempts to update the profile picture with a file that exceeds
    the size allowed. Page should display an error message and no update.
*/
test('Users updates profile picture with a larger size than allowed', async ({ page }) => {

    const profilePage = new ProfilePage(page);
    await page.goto('/dashboard/profile');
    await profilePage.uploadPhoto('./test-assests/largefile.jpg');
    await expect(profilePage.fileExceedsErrorMsg).toBeVisible();
  });

  // Note: Date of Birth is required to update the profile photo.