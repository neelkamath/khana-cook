import {Component, OnDestroy} from '@angular/core';
import {PlacedOrder} from '../../common/models';
import {ACCESS_TOKEN_ERROR, getOrders, SERVER_ERROR} from '../../common/api';
import {getAccessToken, handleInvalidAccessToken} from '../../common/access-token';
import {SERVER_ERROR_MESSAGE} from '../../common/messages';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({selector: 'app-orders', templateUrl: './orders.component.html'})
export class OrdersComponent implements OnDestroy {
    preparingOrders: PlacedOrder[] = [];
    preparedOrders: PlacedOrder[] = [];
    pickedUpOrders: PlacedOrder[] = [];
    // @ts-ignore: Property 'socket' has no initializer and is not definitely assigned in the constructor.
    private readonly socket: WebSocket = new WebSocket('ws://localhost/updates');

    constructor(private message: NzMessageService) {
        this.updateOrders().catch(console.error);
        this.handleUpdates();
    }

    private async updateOrders(): Promise<void> {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        try {
            const response = await getOrders(token);
            this.preparingOrders = response.orders.filter((order) => order.status === 'PREPARING');
            this.preparedOrders = response.orders.filter((order) => order.status === 'PREPARED');
            this.pickedUpOrders = response.orders.filter((order) => order.status === 'PICKED_UP');
        } catch (e) {
            switch (e) {
                case ACCESS_TOKEN_ERROR:
                    handleInvalidAccessToken(this.message);
                    break;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
            }
        }
    }

    private handleUpdates(): void {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        this.socket.addEventListener('open', () => this.socket.send(token));
        this.socket.addEventListener('message', async ({data}) => {
            if (['ORDER', 'ORDER_PREPARED', 'ORDER_PICKED_UP'].includes(JSON.parse(data).type))
                await this.updateOrders();
        });
    }

    ngOnDestroy() {
        this.socket.close();
    }
}
