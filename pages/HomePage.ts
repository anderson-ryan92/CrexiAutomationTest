import {Locator, Page} from "@playwright/test"
import { faker } from '@faker-js/faker';

export class HomePage {

    readonly page : Page;
    readonly loginOrSignupButton : Locator;
    readonly loginTab : Locator;
    readonly firstNameField : Locator;
    readonly lastNameField : Locator;
    readonly emailField : Locator;
    readonly passwordField : Locator;
    readonly phoneNumberField : Locator;
    readonly signupButton : Locator;
    readonly loginButton : Locator;
    readonly dropdownSelect : Locator;
    readonly mainSearchBox : Locator;
    readonly invalidRegisterError : Locator;
    readonly invalidPhoneNumberError : Locator;
    readonly forgotPassword : Locator;
    readonly invalidLogInError : Locator;
    readonly welcomePageheader: Locator;
    readonly firstNameError : Locator;
    readonly lastNameError : Locator;
    readonly emailError : Locator;
    readonly passwordError : Locator;
    readonly validEmailError : Locator;
    readonly passwordMinimumCharError : Locator;
    readonly validPhoneNumberError : Locator;
    readonly loginPasswordError : Locator;
    readonly searchButton : Locator;


    constructor(page : Page) {
        this.page = page;
        this.loginOrSignupButton = page.getByRole('button', { name: ' Sign Up or Log In ' });
        this.loginTab = page.locator('div.tab.switch');
        this.firstNameField = page.locator('input[name="firstName"]');
        this.lastNameField = page.locator('input[name="lastName"]');
        this.emailField = page.locator('input[formcontrolname="email"]');
        this.passwordField = page.locator('input[formcontrolname="password"]');
        this.phoneNumberField = page.locator('input[name="phone"]');
        this.signupButton = page.locator('button[type="submit"]');
        this.loginButton = page.getByTestId('button-login');
        this.dropdownSelect = page.locator('cui-form-field[type="select"]');
        this.mainSearchBox = page.locator('crx-sales-search-form[class="search-form visible"] >* form >* input');
        this.invalidRegisterError = page.getByText('Account creation unsuccessful. If you find this message is unexpected please contact support.');
        this.invalidPhoneNumberError = page.getByText('Please enter a valid phone number');
        this.forgotPassword = page.getByText('Forgot password?');
        this.invalidLogInError = page.getByText('The email/username or password is incorrect.');
        this.welcomePageheader = page.locator('div[builder-model="homepage-h-1"] span[class*="builder-text"] p');
        this.searchButton = page.getByRole('button', { name: ' Search ' });
        this.firstNameError = page.getByText('Please enter your first name');
        this.lastNameError = page.getByText('Please enter your last name');
        this.emailError = page.getByText('Please enter your email address');
        this.passwordError = page.getByText('Please enter a password');
        this.validEmailError = page.getByText('The Email field is not a valid e-mail address.');
        this.passwordMinimumCharError = page.getByText('Minimum 12 characters').nth(1);
        this.validPhoneNumberError = page.getByText('Please enter a valid phone number');
        this.loginPasswordError = page.getByText('Please enter password');
    }

    async login(usernameVal : string, passwordVal : string) {
  
    await this.loginOrSignupButton.click();
    await this.loginTab.waitFor({ state: 'visible' });
    await this.loginTab.click();

    // needed wait here because email login can be flaky
    await this.page.waitForTimeout(1500);
    await this.page.waitForLoadState('domcontentloaded');
    await this.emailField.waitFor({ state: 'visible' });
    await this.emailField.fill(usernameVal);
    await this.passwordField.waitFor({ state: 'visible' });
    await this.passwordField.fill(passwordVal);
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
    await this.welcomePageheader.waitFor({ state: 'visible'});
}

    async signup(emailVal : string, passwordVal : string, phoneNumberVal : string) {

    // Generate random credentials
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
  
    await this.loginOrSignupButton.click();
    await this.firstNameField.fill(randomFirstName);
    await this.lastNameField.fill(randomLastName);
    await this.emailField.fill(emailVal);
    await this.passwordField.fill(passwordVal);
    await this.dropdownSelect.click();
    await this.page.getByRole('option', { name: 'Other' }).click();
    await this.phoneNumberField.fill(phoneNumberVal);
    await this.signupButton.click();
}

    async validateInvalidInput() {
        await this.loginOrSignupButton.click();
        await this.emailField.click();
        await this.emailField.fill('invalidemail');
        await this.passwordField.click();
        await this.passwordField.fill('lessthan12');
        await this.phoneNumberField.click();
        await this.phoneNumberField.fill('invalidnumber');
        await this.signupButton.click();
      }
}