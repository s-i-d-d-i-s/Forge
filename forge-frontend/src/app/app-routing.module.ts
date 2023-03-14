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
import { LogoutComponent } from './components/auth/logout/logout.component';
import { SettingsComponent } from './components/common/settings/settings.component';
import { InternationalTransferComponent } from './components/transfers/international-transfer/international-transfer.component';

const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  {path : 'logout' , component : LogoutComponent},
  {path : 'dashboard' , component : DashboardComponent},
  {path : 'add-expense' , component : AddExpenseComponent},
  {path : 'add-account' , component : AddAccountComponent},
  {path : 'add-asset' , component : AddAssetComponent},
  {path : 'add-stock' , component : AddStockComponent},
  {path : 'domestic-transfer' , component : DomesticTransferComponent},
  {path : 'international-transfer' , component : InternationalTransferComponent},
  {path : 'settings' , component : SettingsComponent},
  {path : 'history/:name', component: AccountHistoryComponent},
  // {path : 'visualize' , component : VisualizeComponent},
  // {path : 'monthly-tracker', component: MonthlyTrackerComponent},
  // {path : 'net-worth-tracker', component: NetWorthTrackerComponent},
  // {path : 'asset-history/:name', component: AssetHistoryComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
