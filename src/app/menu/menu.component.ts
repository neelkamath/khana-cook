import {Component} from '@angular/core';
import {MenuItem} from '../models';
import {readMenu} from '../api';

@Component({selector: 'app-menu', templateUrl: './menu.component.html'})
export class MenuComponent {
    apuItems: MenuItem[] = [];
    breakfastBusItems: MenuItem[] = [];
    engBlockItems: MenuItem[] = [];
    lunchBusItems: MenuItem[] = [];

    constructor() {
        readMenu().then((menu) => {
            for (const item of menu.items)
                if (item.quantity > 0)
                    switch (item.foodPoint) {
                        case 'APU':
                            this.apuItems.push(item);
                            break;
                        case 'Breakfast and Snacks Food Bus':
                            this.breakfastBusItems.push(item);
                            break;
                        case 'Engineering Block':
                            this.engBlockItems.push(item);
                            break;
                        case 'Lunch Food Bus':
                            this.lunchBusItems.push(item);
                    }
        });
    }
}
