import {Component, OnDestroy} from '@angular/core';
import {
    ACCESS_TOKEN_ERROR,
    getReadIncompleteOrders,
    getReadMenu,
    INVALID_FOOD_POINT_ERROR,
    SERVER_ERROR
} from '../../common/api';
import {getAccessToken, handleInvalidAccessToken} from '../../common/access-token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FoodPoint, IncompleteOrder, IncompleteOrderStatus, NewOrder} from '../../common/models';
import {APP_ERROR_MESSAGE, SERVER_ERROR_MESSAGE} from '../../common/messages';

@Component({selector: 'app-incomplete-orders', templateUrl: './incomplete-orders.component.html'})
export class IncompleteOrdersComponent implements OnDestroy {
    foodPoint: FoodPoint = 'APU';
    status: IncompleteOrderStatus = 'PREPARING';
    orders: IncompleteOrder[] = [];
    formSubmitted: boolean = false;
    private readonly socket: WebSocket;

    constructor(private message: NzMessageService) {
        this.socket = new WebSocket('ws://localhost/updates');
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        this.socket.addEventListener('open', () => this.socket.send(token));
        this.handleUpdates();
    }

    handleUpdates(): void {
        this.socket.addEventListener('message', async ({data}) => {
            const message = JSON.parse(data);
            switch (message.type) {
                case 'ORDER':
                    await this.handleOrder(message);
                    break;
                case 'ORDER_PREPARED':
                case 'ORDER_PICKED_UP':
                    this.handleOrderStatusUpdate(message.orderId);
            }
        });
    }

    handleOrderStatusUpdate(orderId: string): void {
        this.orders = this.orders.filter((order) => order.token !== orderId);
    }

    async handleOrder(newOrder: NewOrder): Promise<void> {
        const asyncItems = newOrder.items.map(async (orderItem) => {
            const menu = await getReadMenu();
            const {name, price} = menu.items.find((menuItem) => menuItem.id === orderItem.id)!;
            return {name, price, quantity: orderItem.quantity};
        });
        const items = await Promise.all(asyncItems);
        const price = items.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr);
        if (
            this.formSubmitted
            && newOrder.foodPoint === this.foodPoint
            && this.status === 'PREPARING'
            // Ignore duplicate updates.
            && this.orders.find((order) => order.token === newOrder.orderId) === undefined
        ) this.orders.push({token: newOrder.orderId, status: 'PREPARING', price, items});
    }

    ngOnDestroy(): void {
        this.socket.close();
    }

    async submit(): Promise<void> {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            const response = await getReadIncompleteOrders(this.foodPoint, token);
            this.orders = response.orders.filter((order) => order.status === this.status);
            this.formSubmitted = true;
        } catch (e) {
            switch (e) {
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
                case INVALID_FOOD_POINT_ERROR:
                    this.message.error(APP_ERROR_MESSAGE);
                    return;
            }
        }
    }
}
