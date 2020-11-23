import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountComponent} from './account/account.component';
import {UpdateMenuComponent} from './update-menu/update-menu.component';

const routes: Routes = [
    {path: '', redirectTo: '/account', pathMatch: 'full'},
    {path: 'account', component: AccountComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'update-menu', component: UpdateMenuComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
