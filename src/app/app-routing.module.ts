import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountComponent} from './account/account.component';
import {UpdateMenuComponent} from './update-menu/update-menu.component';
import {MenuComponent} from './menu/menu.component';
import {IncompleteOrdersComponent} from './incomplete-orders/incomplete-orders.component';

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
