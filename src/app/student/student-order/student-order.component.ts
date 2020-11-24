import {Component, Input} from '@angular/core';
import {PlacedOrder} from '../../common/models';

@Component({selector: 'app-student-order', templateUrl: './student-order.component.html'})
export class StudentOrderComponent {
    // @ts-ignore: Property 'order' has no initializer and is not definitely assigned in the constructor.
    @Input() order: PlacedOrder;
}
