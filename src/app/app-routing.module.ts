import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './cook/dashboard/dashboard.component';
import {AccountComponent} from './common/account/account.component';
import {UpdateMenuComponent} from './cook/update-menu/update-menu.component';
import {IncompleteOrdersComponent} from './cook/incomplete-orders/incomplete-orders.component';
import {HomeComponent} from './student/home/home.component';
import {OrdersComponent} from './student/orders/orders.component';
import {MenuComponent} from './common/menu/menu.component';

const routes: Routes = [
    {path: '', redirectTo: 'account', pathMatch: 'full'},
    {path: 'account', component: AccountComponent},
    {path: 'menu', component: MenuComponent},
    {path: 'cook/dashboard', component: DashboardComponent},
    {path: 'cook/update-menu', component: UpdateMenuComponent},
    {path: 'cook/incomplete-orders', component: IncompleteOrdersComponent},
    {path: 'student/home', component: HomeComponent},
    {path: 'student/orders', component: OrdersComponent},
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
