import {Component, Input} from '@angular/core';
import {MenuItem} from '../models';

@Component(
    {selector: 'app-menu-item', templateUrl: './menu-item.component.html', styleUrls: ['./menu-item.component.css']}
)
export class MenuItemComponent {
    // @ts-ignore: Property 'item' has no initializer and is not definitely assigned in the constructor.
    @Input() item: MenuItem;
}
