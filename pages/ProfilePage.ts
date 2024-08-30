import {Locator, Page} from "@playwright/test"

export class ProfilePage {

    readonly page : Page;
    readonly changePhotoButton : Locator;
    readonly fileUploadAvatar : Locator
    readonly editInfoUpdateButton : Locator
    readonly successNotification : Locator
    readonly excludeUnpricecListingsCheckbox : Locator
    readonly applyButton : Locator

    constructor(page : Page) {
        this.page = page;
        this.changePhotoButton = page.getByTestId('userAvatar');
        this.fileUploadAvatar = page.getByTestId('fileUploader-avatar').getByRole('textbox', { name: 'Click to upload your photo' });
        this.editInfoUpdateButton = page.getByRole('button', { name: 'Update' });
        this.successNotification = page.getByTestId('notification');
    }
}