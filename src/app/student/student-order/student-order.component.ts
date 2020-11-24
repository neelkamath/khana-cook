import {Component, Input} from '@angular/core';
import {PlacedOrder} from '../../common/models';

@Component({selector: 'app-student-order', templateUrl: './student-order.component.html'})
export class StudentOrderComponent {
    @Input() order: PlacedOrder = {token: '', status: 'PREPARING', foodPoint: 'APU', items: [], price: 0};
}
