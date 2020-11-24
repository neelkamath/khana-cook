import {Component} from '@angular/core';
import {FoodPoint, Menu, MenuItem} from '../../common/models';
import {getReadMenu, SERVER_ERROR} from '../../common/api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../../common/messages';
import {listenForMenuUpdates} from '../../common/menu-update-listener';

type MenuItems = {
    [key in FoodPoint]: MenuItem[];
};

@Component({selector: 'app-menu', templateUrl: './menu.component.html'})
export class MenuComponent {
    items: MenuItems = {'Breakfast and Snacks Food Bus': [], 'Engineering Block': [], 'Lunch Food Bus': [], 'APU': []};
    private readonly socket: WebSocket = new WebSocket('ws://localhost/updates');

    constructor(private message: NzMessageService) {
        this.fetchMenu().catch(console.error);
        listenForMenuUpdates(this.socket, message, () => this.fetchMenu());
    }

    private async fetchMenu(): Promise<void> {
        let response: Menu;
        try {
            response = await getReadMenu();
        } catch (e) {
            if (e === SERVER_ERROR) this.message.error(SERVER_ERROR_MESSAGE);
            return;
        }
        const items = response.items.filter((item) => item.quantity > 0);
        this.items['APU'] = items.filter((item) => item.foodPoint === 'APU');
        this.items['Breakfast and Snacks Food Bus'] =
            items.filter((item) => item.foodPoint === 'Breakfast and Snacks Food Bus');
        this.items['Engineering Block'] = items.filter((item) => item.foodPoint === 'Engineering Block');
        this.items['Lunch Food Bus'] = items.filter((item) => item.foodPoint === 'Lunch Food Bus');
    }
}
