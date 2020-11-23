import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NzCardModule} from 'ng-zorro-antd/card';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SignUpComponent} from './common/sign-up/sign-up.component';
import {LogInComponent} from './common/log-in/log-in.component';
import {DashboardComponent} from './cook/dashboard/dashboard.component';
import {AccountComponent} from './common/account/account.component';
import {UpdateMenuComponent} from './cook/update-menu/update-menu.component';
import {MenuComponent} from './cook/menu/menu.component';
import {DashboardNavigatorComponent} from './cook/dashboard-navigator/dashboard-navigator.component';
import {IncompleteOrdersComponent} from './cook/incomplete-orders/incomplete-orders.component';
import {SubMenuComponent} from './cook/sub-menu/sub-menu.component';
import {OrderComponent} from './cook/order/order.component';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        SignUpComponent,
        LogInComponent,
        DashboardComponent,
        AccountComponent,
        UpdateMenuComponent,
        DashboardNavigatorComponent,
        MenuComponent,
        IncompleteOrdersComponent,
        SubMenuComponent,
        OrderComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NzButtonModule,
        NzInputModule,
        ReactiveFormsModule,
        NzMessageModule,
        NzRadioModule,
        NzIconModule,
        NzCardModule,
        NzDividerModule,
    ],
    providers: [{provide: NZ_I18N, useValue: en_US}],
    bootstrap: [AppComponent],
})
export class AppModule {
}
