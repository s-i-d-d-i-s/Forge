import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { DashboardComponent } from './components/common/dashboard/dashboard.component';
import { AddExpenseComponent } from './components/add/add-expense/add-expense.component';
import { AddAssetComponent } from './components/add/add-asset/add-asset.component';
import { AddAccountComponent } from './components/add/add-account/add-account.component';
import { DomesticTransferComponent } from './components/transfers/domestic-transfer/domestic-transfer.component';
import { SettingsComponent } from './components/common/settings/settings.component';
import { AddStockComponent } from './components/add/add-stock/add-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountHistoryComponent } from './components/history/account-history/account-history.component';
import { OverviewComponent } from './components/common/overview/overview.component';
import { StockHistoryComponent } from './components/history/stock-history/stock-history.component';
import { InternationalTransferComponent } from './components/transfers/international-transfer/international-transfer.component';
import { MonthlyExpenseHistoryComponent } from './components/history/monthly-expense-history/monthly-expense-history.component';
import { NetWorthTrackerComponent } from './components/history/net-worth-tracker/net-worth-tracker.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthGuard } from './services/auth.guard';
import { OnboardingComponent } from './components/auth/onboarding/onboarding.component';
import { LiquidNetWorthTrackerComponent } from './components/history/liquid-net-worth-tracker/liquid-net-worth-tracker.component';


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
    AccountHistoryComponent,
    OverviewComponent,
    StockHistoryComponent,
    InternationalTransferComponent,
    MonthlyExpenseHistoryComponent,
    NetWorthTrackerComponent,
    OnboardingComponent,
    LiquidNetWorthTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgApexchartsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'session' },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
