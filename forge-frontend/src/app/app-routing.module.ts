import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountHistoryComponent } from './components/history/account-history/account-history.component';
import { AddAccountComponent } from './components/add/add-account/add-account.component';
import { AddAssetComponent } from './components/add/add-asset/add-asset.component';
import { AddExpenseComponent } from './components/add/add-expense/add-expense.component';
import { AddStockComponent } from './components/add/add-stock/add-stock.component';
import { DashboardComponent } from './components/common/dashboard/dashboard.component';
import { DomesticTransferComponent } from './components/transfers/domestic-transfer/domestic-transfer.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { SettingsComponent } from './components/common/settings/settings.component';
import { InternationalTransferComponent } from './components/transfers/international-transfer/international-transfer.component';
import { StockHistoryComponent } from './components/history/stock-history/stock-history.component';
import { MonthlyExpenseHistoryComponent } from './components/history/monthly-expense-history/monthly-expense-history.component';
import { NetWorthTrackerComponent } from './components/history/net-worth-tracker/net-worth-tracker.component';
import { OverviewComponent } from './components/common/overview/overview.component';
import { AuthGuard } from './services/auth.guard';
import { OnboardingComponent } from './components/auth/onboarding/onboarding.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);


const routes: Routes = [
  {path : '' , component : OverviewComponent},
  {path : 'login' , component : LoginComponent},
  {path : 'logout' , component : LogoutComponent},
  {path : 'dashboard' , component : DashboardComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'add-expense' , component : AddExpenseComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'add-account' , component : AddAccountComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'add-asset' , component : AddAssetComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'add-stock' , component : AddStockComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'domestic-transfer' , component : DomesticTransferComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  {path : 'international-transfer' , component : InternationalTransferComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  {path : 'settings' , component : SettingsComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'account/:name', component: AccountHistoryComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  {path : 'stock/:name', component: StockHistoryComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}},
  {path : 'onboarding' , component : OnboardingComponent},
  {path : 'monthly-tracker', component: MonthlyExpenseHistoryComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  {path : 'net-worth-tracker', component: NetWorthTrackerComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
