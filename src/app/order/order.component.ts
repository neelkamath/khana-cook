import {Component, Input, OnInit} from '@angular/core';
import {IncompleteOrder} from '../models';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
    @Input() order: IncompleteOrder = {token: '', status: 'PREPARING', price: 0, items: []};

    constructor() {
    }

    ngOnInit(): void {
    }
}
