import {Component, OnDestroy} from '@angular/core';
import {FoodPoint, MenuItem, NewOrderItem} from '../../common/models';
import {ACCESS_TOKEN_ERROR, getReadMenu, INVALID_ORDER_ERROR, postOrder, SERVER_ERROR} from '../../common/api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../../common/messages';
import {getAccessToken, handleInvalidAccessToken} from '../../common/access-token';
import {listenForMenuUpdates} from '../../common/menu-update-listener';

/**
 * Key-values pairs of items to order. The key is the order ID, and the value is the number of the item to buy.
 */
export interface Ordered {
    [key: string]: number;
}

@Component({selector: 'app-new-order', templateUrl: './new-order.component.html'})
export class NewOrderComponent implements OnDestroy {
    foodPoint: FoodPoint = 'APU';
    items: MenuItem[] = [];
    ordered: Ordered = {};
    private readonly socket: WebSocket = new WebSocket('ws://localhost/updates');

    constructor(private message: NzMessageService) {
        listenForMenuUpdates(this.socket, message, () => this.fetchMenu());
        this.fetchMenu().catch(console.error);
    }

    ngOnDestroy() {
        this.socket.close();
    }

    async fetchMenu(): Promise<void> {
        this.ordered = {};
        try {
            const response = await getReadMenu();
            this.items = response.items.filter((item) => item.foodPoint === this.foodPoint);
        } catch (e) {
            if (e === SERVER_ERROR) this.message.error(SERVER_ERROR_MESSAGE);
            return;
        }
    }

    async order(): Promise<void> {
        let items: NewOrderItem[] = [];
        for (const orderId in this.ordered)
            if (this.ordered.hasOwnProperty(orderId)) items.push({id: orderId, quantity: this.ordered[orderId]});
        if (items.length === 0 || items.map((item) => item.quantity).reduce((prev, next) => prev + next) === 0) {
            this.message.error('Please select items to order.');
            return;
        }
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            await postOrder(token, {foodPoint: this.foodPoint, items});
        } catch (e) {
            switch (e) {
                case INVALID_ORDER_ERROR:
                    this.message.error("An item you ordered isn't available in the desired quantity.");
                    return;
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
            }
        }
        this.message.success('Order placed! 🙂');
    }
}
