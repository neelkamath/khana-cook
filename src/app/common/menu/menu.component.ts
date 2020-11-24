import {Component} from '@angular/core';
import {FoodPoint, Menu, MenuItem} from '../models';
import {getReadMenu, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../messages';
import {getAccessToken, handleInvalidAccessToken} from '../access-token';

type MenuItems = {
    [key in FoodPoint]: MenuItem[];
};

@Component({selector: 'app-menu', templateUrl: './menu.component.html'})
export class MenuComponent {
    items: MenuItems = {'Breakfast and Snacks Food Bus': [], 'Engineering Block': [], 'Lunch Food Bus': [], 'APU': []};
    socket: WebSocket;

    constructor(private message: NzMessageService) {
        this.fetchMenu().catch(console.error);
        this.socket = new WebSocket('ws://localhost/updates');
        this.handleUpdates();
    }

    handleUpdates(): void {
        const token = getAccessToken();
        if (token === null) {
            handleInvalidAccessToken(this.message);
            return;
        }
        this.socket.addEventListener('open', () => this.socket.send(token));
        this.socket.addEventListener('message', async ({data}) => {
            if (JSON.parse(data).type === 'MENU_UPDATE') await this.fetchMenu();
        });
    }

    async fetchMenu(): Promise<void> {
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
