import {Component} from '@angular/core';
import {UpdatedMenuItem} from '../../common/models';
import {ACCESS_TOKEN_ERROR, postUpdateMenu, SERVER_ERROR} from '../../common/api';
import {getAccessToken, handleInvalidAccessToken} from '../../common/access-token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../../common/messages';

@Component({selector: 'app-update-menu', templateUrl: './update-menu.component.html'})
export class UpdateMenuComponent {
    item: UpdatedMenuItem = {
        foodPoint: 'APU',
        name: 'Bun Samosa',
        picUrl: 'https://github.com/neelkamath/khana-backend/raw/master/docs/sandwich.jpg',
        quantity: 50,
        price: 20,
    };

    constructor(private message: NzMessageService) {
    }

    async submit(): Promise<void> {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            await postUpdateMenu(this.item, token);
        } catch (e) {
            switch (e) {
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
            }
        }
        this.message.success('Menu updated!');
    }
}
