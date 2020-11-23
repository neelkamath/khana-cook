import {Component, OnInit} from '@angular/core';
import {UpdatedMenuItem} from '../models';
import {ACCESS_TOKEN_ERROR, SERVER_ERROR, updateMenu} from '../api';
import {getAccessToken, handleInvalidAccessToken} from '../access-token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../messages';

@Component({
    selector: 'app-update-menu',
    templateUrl: './update-menu.component.html',
})
export class UpdateMenuComponent implements OnInit {

    item: UpdatedMenuItem = {
        foodPoint: 'APU',
        name: 'Bun Samosa',
        picUrl: 'https://github.com/neelkamath/khana-backend/raw/master/docs/sandwich.jpg',
        quantity: 50,
        price: 20,
    };

    constructor(private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    async submit(): Promise<void> {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            await updateMenu(this.item, token);
        } catch (e) {
            switch (e) {
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    break;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
            }
            return;
        }
        this.message.success('Menu updated!');
    }

}
