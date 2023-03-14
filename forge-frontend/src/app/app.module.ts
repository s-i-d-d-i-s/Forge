import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { DomesticTransferComponent } from './components/domestic-transfer/domestic-transfer.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountHistoryComponent } from './components/account-history/account-history.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
    AddExpenseComponent,
    AddAssetComponent,
    AddAccountComponent,
    DomesticTransferComponent,
    SettingsComponent,
    AddStockComponent,
    AccountHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'session' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
