import {Component, Input, OnInit} from '@angular/core';
import {FoodPoint, MenuItem} from '../models';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
    @Input() foodPoint: FoodPoint = 'APU';
    @Input() items: MenuItem[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}
