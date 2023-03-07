import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { Asset } from 'src/app/models/Asset.model';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { Stock } from 'src/app/models/Stock.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  accounts: Account[];
  expenses: Expense[];
  stocks: Stock[];
  assets: Asset[];
  currentSettings: Settings;
  
  constructor(public db:DatabaseService) {
    this.accounts = [];
    this.expenses = [];
    this.assets = [];
    this.stocks = [];
    this.currentSettings = new Settings();
  }

  ngOnInit(): void {
    this.db.accounts.subscribe(
      (data:Account[]) => {
        this.accounts = data;
      }
    )
    this.db.totalExpenses.subscribe(
      (data:Expense[]) => {
        this.expenses = data;
      }
    )
    this.db.investments.subscribe(
      (data:Stock[]) => {
        var cumulative_assets_hashmap:{[key:string]:number[]} = {};
        for(let i=0;i<data.length;i++){
          if(cumulative_assets_hashmap.hasOwnProperty(data[i].name) ){
            cumulative_assets_hashmap[data[i].name][0] += +data[i].amount;
          }else{
            cumulative_assets_hashmap[data[i].name] = [+data[i].amount,+data[i].price!];
          }
        }
        var cumulative_assets:Stock[] = [];
        for(let x in cumulative_assets_hashmap){
          cumulative_assets.push(<Stock>{name:x, amount:cumulative_assets_hashmap[x][0], timestamp:new Date(), price:cumulative_assets_hashmap[x][1] });
        }
        this.stocks = cumulative_assets;
      }
    )
    this.db.settings.subscribe(
      (data:Settings) => {
        this.currentSettings = data;
      }
    )
    setTimeout(()=>{
      this.accounts.sort(
        (a:Account,b:Account) => {
          var bal1 = this.getBalanceOfAccount(a.name);
          var bal2 = this.getBalanceOfAccount(b.name);
          if(bal1 < bal2)return 1;
          return -1;
        }
      )
    },4000);
  }


  getBalanceOfAccount(name:string){
    var currentBalance = 0;
    for(let i=0;i<this.expenses.length;i++){
      if(this.expenses[i]['account'] != name){
        continue;
      }
      if(this.expenses[i].amountType == 'Credit'){
        currentBalance += this.expenses[i]['amount'];
      }else{
        currentBalance -= this.expenses[i]['amount'];
      }
    }
    currentBalance = +currentBalance.toFixed(2); //Math.round(currentBalance* 100) / 100;
    
    if(currentBalance < 0 && currentBalance >= -0.02){
      currentBalance=0;
    }
    return currentBalance;
  }
  getTotalMoneyInBanks(){
    var currentBalance = 0;
    for(let i=0;i<this.expenses.length;i++){
      if(this.expenses[i].amountType == 'Credit'){
        currentBalance += this.expenses[i]['amount'];
      }else{
        currentBalance -= this.expenses[i]['amount'];
      }
    }
    return currentBalance;
  }
  getTotalMoneyInInvestments(){
    var currentBalance = 0;
    for(let i=0;i<this.stocks.length;i++){
      currentBalance += this.stocks[i].amount * this.stocks[i].price!;
    }
    return currentBalance;
  }

  getTotalNetWorth(){
    var result = this.getTotalMoneyInBanks() + this.getTotalMoneyInInvestments();
    result = Math.round(result* 100) / 100;
    return result;
  }
  formatAmount(amount:number){
    return +amount.toFixed(2);
  }

  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
}
