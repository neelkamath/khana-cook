import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './cook/dashboard/dashboard.component';
import {AccountComponent} from './common/account/account.component';
import {UpdateMenuComponent} from './cook/update-menu/update-menu.component';
import {MenuComponent} from './cook/menu/menu.component';
import {IncompleteOrdersComponent} from './cook/incomplete-orders/incomplete-orders.component';

const routes: Routes = [
    {path: '', redirectTo: 'account', pathMatch: 'full'},
    {path: 'account', component: AccountComponent},
    {path: 'cook/dashboard', component: DashboardComponent},
    {path: 'cook/update-menu', component: UpdateMenuComponent},
    {path: 'cook/menu', component: MenuComponent},
    {path: 'cook/incomplete-orders', component: IncompleteOrdersComponent},
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
