import {Component, Input} from '@angular/core';
import {FoodPoint, MenuItem} from '../../common/models';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.css'],
})
export class SubMenuComponent {
    @Input() foodPoint: FoodPoint = 'APU';
    @Input() items: MenuItem[] = [];
}
