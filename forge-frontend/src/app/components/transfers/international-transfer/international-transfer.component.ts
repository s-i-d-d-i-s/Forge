import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-international-transfer',
  templateUrl: './international-transfer.component.html',
  styleUrls: ['./international-transfer.component.css']
})
export class InternationalTransferComponent implements OnInit {

  expense_1 = <Expense>{};
  expense_2 = <Expense>{};


  show_alert = false;

  accounts: Account[];

  currency_types: string[];
  amount_types: string[];
  settings: Settings = new Settings();

  constructor(private db: DatabaseService, public auth: AuthenticationService) {
    this.accounts = [];
    this.currency_types = [
      'INR',
      'EUR'
    ]
    this.amount_types = [
      'Credit',
      'Debit'
    ]
    this.expense_1.currency = this.currency_types[1];
    this.expense_1.amountType = this.amount_types[1];
    this.expense_1.timestamp = new Date(Date.now());

    this.expense_2.currency = this.currency_types[0];
    this.expense_2.amountType = this.amount_types[0];
    this.expense_2.timestamp = new Date(Date.now());
  }

  reset_expense(): void {
    this.expense_1.amount = 0;
    this.expense_1.timestamp = new Date(Date.now());

    this.expense_2.amount = 0;
    this.expense_2.timestamp = new Date(Date.now());
  }
  ngOnInit(): void {
    this.db.accounts.subscribe(
      (data) => {
        this.accounts = data;
        this.expense_1.account = data[0].name;
        this.expense_2.account = data[1].name;
      }
    )
    this.db.settings.subscribe(
      (data) => {
        this.settings = data;
      }
    )
  }

  transferAmount() {
    this.auth.user?.getIdToken().then(
      (data) => {
        this.expense_1.name = 'Transferring: ' + this.expense_1.account + " -> " + this.expense_2.account + ' - 1';
        this.expense_1.amountType = "Debit";

        this.expense_2.name = 'Transferring: ' + this.expense_1.account + " -> " + this.expense_2.account + ' - 2';
        this.expense_2.amountType = "Credit";

        this.db.addExpense(this.expense_1, this.auth.user!.uid, data);
        this.db.addExpense(this.expense_2, this.auth.user!.uid, data);

        this.show_alert = true;
        setTimeout(() => {
          this.show_alert = false;
          this.reset_expense();
        }, 2000);
      }
    )
  }

}
