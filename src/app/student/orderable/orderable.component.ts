import {Component, Input} from '@angular/core';
import {MenuItem} from '../../common/models';
import {Ordered} from '../new-order/new-order.component';

@Component({selector: 'app-orderable', templateUrl: './orderable.component.html'})
export class OrderableComponent {
    // @ts-ignore: Property 'item' has no initializer and is not definitely assigned in the constructor.
    @Input() item: MenuItem;
    // @ts-ignore: Property 'ordered' has no initializer and is not definitely assigned in the constructor.
    @Input() ordered: Ordered;
}
