import {Locator, Page} from "@playwright/test"

export class PropertyDetailPage {

    readonly page : Page;
    readonly listingContactsNames : Locator;
    readonly detailsSection : Locator;

    constructor(page : Page) {
        this.page = page;
        this.listingContactsNames = page.locator('li[data-cy="broker"] > div > div[class="name"] > a');
        this.detailsSection = page.locator('div[class="property-info-data"] > crx-sales-attributes');

    }
}