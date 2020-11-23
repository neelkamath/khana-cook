import {Component, OnInit} from '@angular/core';
import {ACCESS_TOKEN_ERROR, INVALID_FOOD_POINT_ERROR, readIncompleteOrders, SERVER_ERROR} from '../api';
import {getAccessToken, handleInvalidAccessToken} from '../access-token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FoodPoint, IncompleteOrder, IncompleteOrders} from '../models';
import {APP_ERROR_MESSAGE, SERVER_ERROR_MESSAGE} from '../messages';

type OrderStatus = 'PREPARING' | 'PREPARED';

@Component({
    selector: 'app-incomplete-orders',
    templateUrl: './incomplete-orders.component.html',
})
export class IncompleteOrdersComponent implements OnInit {
    foodPoint: FoodPoint = 'APU';
    status: OrderStatus = 'PREPARING';
    orders: IncompleteOrder[] = [];
    formSubmitted: boolean = false;

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
        let response: IncompleteOrders;
        try {
            response = await readIncompleteOrders(this.foodPoint, token);
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
        this.orders = response.orders.filter((order) => order.status === this.status);
        this.formSubmitted = true;
    }
}
