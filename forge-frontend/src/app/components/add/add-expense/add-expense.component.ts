import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  show_alert = false;
  expense = <Expense>{};
  viewing_currency = '';
  settings: Settings = new Settings();
  eur_accounts: Account[];
  inr_accounts: Account[];
  usd_accounts: Account[];
  amountTypes: string[];
  currencyTypes: string[];

  constructor(private db: DatabaseService,public auth:AuthenticationService) {
    this.eur_accounts = [];
    this.inr_accounts = [];
    this.usd_accounts = [];

    this.amountTypes = [
      'Credit',
      'Debit'
    ]
    
    this.currencyTypes = [
      'INR',
      'EUR',
      'USD'
    ]
    this.expense.timestamp = new Date(Date.now());
    this.expense.amountType = this.amountTypes[1];
    this.expense.currency = this.currencyTypes[0];
    this.viewing_currency = this.getViewingCurrency()!;
  }

  ngOnInit(): void {
    this.db.accounts.subscribe(
      (data) => {
        if (data.length > 0)
          this.expense.account = data[0].name;
        console.log(data);
        for (let account of data) {
          if (account.closed == false && account.currency == "INR") {
            this.inr_accounts.push(account);
          } else if (account.closed == false && account.currency == "EUR") {
            this.eur_accounts.push(account);
          } else if (account.closed == false && account.currency == "USD") {
            this.usd_accounts.push(account);
          }
        }
        console.log(this.usd_accounts);
      }
    )
    this.db.settings.subscribe(
      (data) => {
        this.settings = data;
      }
    )
  }

  addExpense() {
    this.auth.user?.getIdToken().then(
      (data) => {
        this.db.addExpense(this.expense,this.auth.user!.uid,data);
        this.show_alert = true;
        setTimeout(() => {
          this.show_alert = false;
        }, 2000);
        this.expense.amount = 0;
        this.expense.name = '';
      }
    )
    
  }

  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
  get_viewing_currency_symbol(){
    if(this.expense.currency == 'INR'){
      return '₹'
    }else if(this.expense.currency == 'EUR'){
      return '€';
    }
    return '$';
  }
}
