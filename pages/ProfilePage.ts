import {Locator, Page} from "@playwright/test"
import path from 'path';

export class ProfilePage {

    readonly page : Page;
    readonly changePhotoButton : Locator;
    readonly fileUploadAvatar : Locator
    readonly editInfoUpdateButton : Locator
    readonly successNotification : Locator
    readonly excludeUnpricecListingsCheckbox : Locator
    readonly applyButton : Locator
    readonly fileExceedsErrorMsg;


    constructor(page : Page) {
        this.page = page;
        this.changePhotoButton = page.getByTestId('userAvatar');
        this.fileUploadAvatar = page.getByTestId('fileUploader-avatar').getByRole('textbox', { name: 'Click to upload your photo' });
        this.editInfoUpdateButton = page.getByRole('button', { name: 'Update' });
        this.successNotification = page.getByTestId('notification');
        this.fileExceedsErrorMsg = page.getByText('File must not exceed 3 MB');
    }

    async uploadPhoto(filePath: string) {
        await this.changePhotoButton.click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.fileUploadAvatar.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
        await this.editInfoUpdateButton.click();
      }
}