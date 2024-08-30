import {Locator, Page} from "@playwright/test"

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
        this.mainSearchBox = page.locator('crx-sales-search-form[class="search-form visible"] >* form >* input')

    }

    async login(usernameVal : string, passwordVal : string) {
  
    await this.loginOrSignupButton.click();

    await this.loginTab.waitFor({ state: 'visible' });
    await this.loginTab.click();

    await this.page.waitForTimeout(3000);
    await this.emailField.waitFor({ state: 'visible' });
    await this.emailField.fill(usernameVal);

    await this.passwordField.waitFor({ state: 'visible' });
    await this.passwordField.fill(passwordVal);

    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
    await this.page.waitForTimeout(3000);

    }

}