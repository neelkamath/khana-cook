import {Component, Input} from '@angular/core';
import {FoodPoint, MenuItem} from '../../common/models';

@Component({selector: 'app-sub-menu', templateUrl: './sub-menu.component.html'})
export class SubMenuComponent {
    // @ts-ignore: Property 'foodPoint' has no initializer and is not definitely assigned in the constructor.
    @Input() foodPoint: FoodPoint;
    // @ts-ignore: Property 'items' has no initializer and is not definitely assigned in the constructor.
    @Input() items: MenuItem[];
}
