import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/models/Account.model';
import { Expense } from 'src/app/models/Expense.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.css']
})
export class AccountHistoryComponent implements OnInit {
  selectedExpenses: Expense[];
  expense_history: Map<string,Expense[]>;
  accounts: Account[];
  selected_account = '';
  originalOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return -1;
  }
  MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  constructor(private db:DatabaseService,private route: ActivatedRoute) {
    this.accounts = [];
    this.selectedExpenses = [];
    this.expense_history = new Map<string,Expense[]>();
    this.selected_account = this.route.snapshot.paramMap.get('name')!;
  }

  ngOnInit(): void {
    this.db.accounts.subscribe(
      (data) => {
        this.accounts = data;
      }
    )
    this.db.totalExpenses.subscribe(
      (data) => {
        for(let i=0;i<data.length;i++){
          if(data[i].account == this.selected_account){            
            this.selectedExpenses.push(data[i]);
          }
        }
        this.selectedExpenses.sort(
          (a: Expense, b: Expense) => {
            var result = (new Date(a.timestamp)).getTime() < (new Date(b.timestamp)).getTime();
            if (result) return -1;
            return 1;
          }
        )
        for(let expense of this.selectedExpenses){
            var quarter = this.getQuater(expense.timestamp);
            var month = this.getDate(expense.timestamp);
            if(this.expense_history.get(quarter) == undefined)
              this.expense_history.set(quarter, []);
            var expense_of_this_quarter = this.expense_history.get(quarter);
            expense_of_this_quarter?.push(expense);
            this.expense_history.set(quarter,expense_of_this_quarter!);
        }
        for(let y of this.expense_history){
          var expense_of_this_quarter = this.expense_history.get(y);
          expense_of_this_quarter.reverse();
          this.expense_history.set(y,expense_of_this_quarter!);
        } 
      }
    )
  }

  getDate(timestamp:Date){
    return (new Date(timestamp)).getDate() + ' ' + this.MONTHS[ +((new Date(timestamp)).getMonth()) ] +  ' ' + (new Date(timestamp)).getFullYear()
  }

  getQuater(timestamp:Date){
    return "Q" + ( Math.floor(((new Date(timestamp)).getMonth())/3) +1) +  ' ' + (new Date(timestamp)).getFullYear()
  }
}
