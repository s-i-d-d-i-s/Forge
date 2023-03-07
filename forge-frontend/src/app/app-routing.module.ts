import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  // {path : '' , component : OverviewComponent},
  // {path : 'balance' , component : BalanceTrackerComponent},
  // {path : 'add' , component : AddExpenseComponent},
  // {path : 'transfer' , component : TransferComponent},
  // {path : 'add-account' , component : AddAccountComponent},
  // {path : 'add-asset' , component : AddInvestmentComponent},
  // {path : 'visualize' , component : VisualizeComponent},
  // {path : 'settings' , component : SettingsComponent},
  // {path : 'monthly-tracker', component: MonthlyTrackerComponent},
  // {path : 'net-worth-tracker', component: NetWorthTrackerComponent},
  // {path : 'history/:name', component: AccountHistoryComponent},
  // {path : 'asset-history/:name', component: AssetHistoryComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
