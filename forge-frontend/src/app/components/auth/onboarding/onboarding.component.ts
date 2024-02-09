import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { Expense } from 'src/app/models/Expense.model';
import { Stock } from 'src/app/models/Stock.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  account: Account = {name:"",currency:"INR",closed:false};
  stock : Stock = {name:'', symbol:'', amount:0, timestamp: new Date(Date.now())};

  currency_types = [
    'INR',
    'EUR'
  ]
  constructor(public db:DatabaseService, public auth:AuthenticationService) {

  }

  ngOnInit(): void {
  }

  complete_onboarding(){
    if(this.account.name.length == 0){
      alert("Account name can't be empty");
      return;
    }
    if(this.account.currency.indexOf("INR") == -1 && this.account.currency.indexOf("EUR") == -1){
      alert("Account currency can either be INR or EUR");
      return;
    }
    if(this.stock.name.indexOf("GOOG") == -1 ){
      alert("Currently GOOG is the only supported stock.");
      return;
    }
    
    this.auth.user?.getIdToken().then(
      (data) => {
        this.db.addAccount(this.account);
        var expense = <Expense>{};
        expense.account = this.account.name;
        expense.amount = 0;
        expense.amountType = "Credit";
        expense.currency = this.account.currency;
        expense.name = "Initialization";
        expense.timestamp = new Date(Date.now());
        this.db.addExpense(expense,this.auth.user!.uid,data);
        this.db.mark_onboarded(this.auth.user!.uid,data)
        this.db.addStock(this.stock);
      }
    )
    
    
  }
}
