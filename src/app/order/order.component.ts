import {Component, Input} from '@angular/core';
import {IncompleteOrder} from '../models';
import {ACCESS_TOKEN_ERROR, INVALID_ORDER_UPDATE_ERROR, pickUpOrder, prepareOrder, SERVER_ERROR} from '../api';
import {getAccessToken, handleInvalidAccessToken} from '../access-token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {APP_ERROR_MESSAGE, SERVER_ERROR_MESSAGE} from '../messages';

@Component({selector: 'app-order', templateUrl: './order.component.html'})
export class OrderComponent {
    @Input() order: IncompleteOrder = {token: '', status: 'PREPARING', price: 0, items: []};

    constructor(private message: NzMessageService) {
    }

    async update(): Promise<void> {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            switch (this.order.status) {
                case 'PREPARING':
                    await prepareOrder(this.order.token, token);
                    break;
                case 'PREPARED':
                    await pickUpOrder(this.order.token, token);
            }
        } catch (e) {
            switch (e) {
                case INVALID_ORDER_UPDATE_ERROR:
                    this.message.error(APP_ERROR_MESSAGE);
                    return;
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
            }
        }
    }
}
