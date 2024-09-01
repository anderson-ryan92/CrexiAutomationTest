import {Locator, Page} from "@playwright/test"

export class PropertiesPage {

    readonly page : Page;
    readonly propertyTile : Locator;
    readonly anyPriceDropdown : Locator;
    readonly priceBox : Locator;
    readonly minValueInput : Locator;
    readonly excludeUnpricecListingsCheckbox : Locator;
    readonly applyButton : Locator;
    readonly propertyTiles : Locator;

    constructor(page : Page) {
        this.page = page;
        this.propertyTile = page.getByTestId('propertyTile');
        this.anyPriceDropdown = page.locator('crx-range-dropdown[formtitle="Price"]');
        this.priceBox = page.locator('div[class="content ng-star-inserted bottom-right"]')
        this.minValueInput = page.locator('input[name="minValue"]');
        this.excludeUnpricecListingsCheckbox = page.locator('input[type="checkbox"]');
        this.applyButton = page.getByRole('button', { name: 'Apply' });
        this.propertyTiles = page.locator('crx-property-tile-aggregate[data-cy="propertyTile"]');
    }
}