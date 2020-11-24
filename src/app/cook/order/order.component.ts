import {Component, Input} from '@angular/core';
import {
    ACCESS_TOKEN_ERROR,
    INVALID_ORDER_UPDATE_ERROR,
    postPickUpOrder,
    postPrepareOrder,
    SERVER_ERROR
} from '../../common/api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {IncompleteOrder} from '../../common/models';
import {getAccessToken, handleInvalidAccessToken} from '../../common/access-token';
import {APP_ERROR_MESSAGE, SERVER_ERROR_MESSAGE} from '../../common/messages';

@Component({selector: 'app-order', templateUrl: './order.component.html'})
export class OrderComponent {
    // @ts-ignore: Property 'order' has no initializer and is not definitely assigned in the constructor.
    @Input() order: IncompleteOrder;

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
                    await postPrepareOrder(this.order.token, token);
                    break;
                case 'PREPARED':
                    await postPickUpOrder(this.order.token, token);
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
