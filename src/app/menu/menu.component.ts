import {Component, OnInit} from '@angular/core';
import {MenuItem} from '../models';
import {readMenu} from '../api';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {

    items: MenuItem[] = [];

    constructor() {
        this.setMenu().catch(console.error);
    }

    async setMenu(): Promise<void> {
        const menu = await readMenu();
        this.items = menu.items.filter((item) => item.quantity > 0);
    }

    ngOnInit(): void {
    }

}
