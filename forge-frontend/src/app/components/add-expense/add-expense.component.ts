import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  show_alert = false;
  current_name = '';
  current_account = '';
  current_amount = 0;
  current_amountType = '';
  current_currencyType = '';
  current_date = new Date(Date.now());
  settings: Settings = new Settings();
  eur_accounts: Account[];
  inr_accounts: Account[];
  amountTypes: string[];
  currencyTypes: string[];

  constructor(private db: DatabaseService) {
    this.eur_accounts = [];
    this.inr_accounts = [];

    this.amountTypes = [
      'Credit',
      'Debit'
    ]
    this.current_amountType = this.amountTypes[1];
    this.currencyTypes = [
      'INR',
      'EUR'
    ]
    this.current_currencyType = this.getViewingCurrency()!;
  }

  ngOnInit(): void {
    this.db.accounts.subscribe(
      (data) => {
        if (data.length > 0)
          this.current_account = data[0].name;
        for (let account of data) {
          if (account.closed == false && account.currency == "INR") {
            this.inr_accounts.push(account);
          } else if (account.closed == false && account.currency == "EUR") {
            this.eur_accounts.push(account);
          }
        }
      }
    )
    this.db.settings.subscribe(
      (data) => {
        this.settings = data;
      }
    )
  }

  addExpense() {
    var expense = <Expense>{};
    expense.name = this.current_name;
    expense.account = this.current_account;
    expense.timestamp = this.current_date;
    expense.amount = this.current_amount;
    expense.amountType = this.current_amountType;
    expense.currency = this.current_currencyType

    this.db.addExpense(expense);
    this.show_alert = true;
    setTimeout(() => {
      this.show_alert = false;
    }, 2000);
    this.current_amount = 0;
    this.current_name = '';
  }

  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
}
