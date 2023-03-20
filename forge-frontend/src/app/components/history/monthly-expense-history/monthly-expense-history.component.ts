import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-monthly-expense-history',
  templateUrl: './monthly-expense-history.component.html',
  styleUrls: ['./monthly-expense-history.component.css']
})
export class MonthlyExpenseHistoryComponent implements OnInit {
  current_month = '';
  current_year = '';
  selectedExpenses: Expense[];
  allExpenses: Expense[];
  MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  YEARS = [
    "2022", "2023", "2024"
  ];

  info_spent = 0;
  info_left = 0;

  settings: Settings = new Settings();
  monthly_cap = 0;

  constructor(private db: DatabaseService) {
    this.selectedExpenses = [];
    this.allExpenses = [];
    
  }

  ngOnInit(): void {
    this.db.totalExpenses.subscribe(
      (data) => {
        this.allExpenses = data;
        this.current_month = this.MONTHS[(new Date(Date.now())).getMonth()];
        this.current_year = ""+(new Date(Date.now())).getFullYear();
        this.showReport();
      }
    )
    this.db.settings.subscribe(
      (data) =>{
        this.monthly_cap = data.monthly_cap;
      }
    )
  }

  getReport(month:string,year:string) {
    //console.log("Month: "+month + "Year: " + year);

    var resultExpenses = [];
    for (let i = 0; i < this.allExpenses.length; i++) {
      var this_month = this.MONTHS[(new Date(this.allExpenses[i].timestamp)).getMonth()];
      var this_year = (new Date(this.allExpenses[i].timestamp)).getFullYear();
      if (month == this_month && (+year) == this_year) {
        resultExpenses.push(this.allExpenses[i]);
      }
    }
    resultExpenses.sort(
      (a: Expense, b: Expense) => {
        var result = (new Date(a.timestamp)).getTime() < (new Date(b.timestamp)).getTime();
        if (result) return -1;
        return 1;
      }
    )

    var spent = 0;
    var left = this.monthly_cap;
    for(let i=0;i<resultExpenses.length;i++){
      if(resultExpenses[i].name.indexOf("Salary") != -1 || resultExpenses[i].name.indexOf("salary") != -1 ){
        continue;
      }
      if(resultExpenses[i].amountType == "Debit"){
        spent += resultExpenses[i].amount;
        left -=  resultExpenses[i].amount;
      }else{
        spent -= resultExpenses[i].amount;
        left +=  resultExpenses[i].amount;
      }
    }
    var response =  {
      'expenses': resultExpenses,
      'spent': spent,
      'left': left
    };
    return response;
  }


  showReport() {
    var response = this.getReport(this.current_month,this.current_year);
    this.selectedExpenses = response['expenses'];
    this.info_spent = response['spent'];
    this.info_spent = Math.round(this.info_spent* 100) / 100;

    this.info_left = response['left'];
    this.info_left = Math.round(this.info_left* 100) / 100;
  }

  getDate(timestamp:Date){
    return (new Date(timestamp)).getDate() + ' ' + this.MONTHS[ +((new Date(timestamp)).getMonth()) ] +  ' ' + (new Date(timestamp)).getFullYear()
  }

  formatAmount(amount:number){
    var formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.getViewingCurrency()!,
    });
    
    return formatter.format(+amount.toFixed(2)).substring(1);
  }

  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
}
