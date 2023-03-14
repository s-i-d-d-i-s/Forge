import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/Account.model';
import { Expense } from '../models/Expense.model';
import { Stock } from '../models/Stock.model';
import { Settings } from '../models/Settings.model';

const DATABASE_BASE = 'https://deoxys-prod-default-rtdb.firebaseio.com/'
var EXPENSES = DATABASE_BASE + 'users/<<uid>>/expenses.json';
var ACCOUNTS = DATABASE_BASE + 'users/<<uid>>/accounts.json';
var SETTINGS = DATABASE_BASE + 'users/<<uid>>/settings.json';
var INVESTMENTS = DATABASE_BASE + 'users/<<uid>>/investment.json';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  totalExpenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  accounts: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  investments: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  settings: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());
  constructor(private http: HttpClient) {

  }

  refreshData(userToken: string, uid: string) {
    SETTINGS = SETTINGS.replace("<<uid>>", uid);
    EXPENSES = EXPENSES.replace("<<uid>>", uid);
    ACCOUNTS = ACCOUNTS.replace("<<uid>>", uid);
    INVESTMENTS = INVESTMENTS.replace("<<uid>>", uid);
    
    this.getSettings().subscribe(
      (data) => {
        console.log(data);
        if (data != null) {
          this.settings.next(data);
          this.getAllExpense();
        }
        this.getAllAccounts();
        this.getAllAsset();
      }
    )
  }






  addExpense(expense: Expense): void {
    this.http.post(EXPENSES, expense).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        this.getAllExpense();
      }
    )
  }
  getAllExpense(): void {
    var viewingCurrency = this.getViewingCurrency();
    this.http.get<{ [index: string]: Expense }>(EXPENSES).subscribe(
      (data) => {
        var fetchedExpenses: Expense[] = [];
        for (let key in data) {
            if (viewingCurrency == "INR" && data[key].currency == "EUR") {
              this.settings.subscribe(
                (resp) => {
                  var forex = resp.EUR_to_INR;
                  data[key].amount *= forex;
                  data[key].amount = Math.round(data[key].amount * 100) / 100
                  fetchedExpenses.push(data[key]);
                }
              )
            } else if (viewingCurrency == "EUR" && (data[key].currency == undefined || data[key].currency == null || data[key].currency == "INR")) {
              this.settings.subscribe(
                (resp) => {
                  var forex = resp.EUR_to_INR;
                  data[key].amount /= forex;
                  data[key].amount = Math.round(data[key].amount * 100) / 100
                  fetchedExpenses.push(data[key]);
                }
              )
            } else {
              fetchedExpenses.push(data[key]);
            }
        }
        this.totalExpenses.next(fetchedExpenses);
      }
    )
  }


  addAccount(account: Account): void {
    this.http.post(ACCOUNTS, account).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        this.getAllAccounts();
      }
    )
  }

  addStock(investment: Stock){
    this.http.post(INVESTMENTS, investment).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        this.getAllAccounts();
      }
    )
  }

  getAllAccounts(): void {
    this.http.get<{ [index: string]: Account }>(ACCOUNTS).subscribe(
      (data) => {
        var fetchedAccounts: Account[] = [];
        for (let key in data) {
          fetchedAccounts.push(data[key]);
        }
        this.accounts.next(fetchedAccounts);
      }
    )
  }



  getAllAsset(): void {
    this.http.get<{ [index: string]: Stock }>(INVESTMENTS).subscribe(
      (data) => {
        var fetchedInvestments: Stock[] = [];
        for (let key in data) {
          var apiUrl = 'https://finnhub.io/api/v1/quote?symbol='+data[key].name+'&token=cdejmo2ad3i8vpup3i2gcdejmo2ad3i8vpup3i30';
          this.http.get<{[index:string]: number }>(apiUrl).subscribe(
            (data2) => {
              this.settings.subscribe(
                (resp) => {
                  var viewingCurrency = this.getViewingCurrency();
                  var forex = resp.USD_to_EUR;
                  data[key].price = data2['c'] * forex;
                  if(viewingCurrency == "INR"){
                    data[key].price = data[key].price! * resp.EUR_to_INR;
                  }
                  fetchedInvestments.push(data[key]);
                  this.investments.next(fetchedInvestments);
                }
              )
            }
          )
        }
        
      }
    )
  }

  setViewingCurrency(currency: string) {
    localStorage.setItem("View_Currency", currency);
  }
  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }

  toggleGraphMode() {
    var currentMode = this.getGraphMode();
    localStorage.setItem("Graph_With_Investment", currentMode=='false'?'true':'false');
  }
  getGraphMode() {
    if (localStorage.getItem("Graph_With_Investment") != null) {
      return localStorage.getItem("Graph_With_Investment");
    }    
    return 'false';
  }



  addSettings(settings: Settings): void {
    this.http.put(SETTINGS, settings).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        this.refreshData('', '');
      }
    )
  }

  getSettings() {
    return this.http.get<Settings>(SETTINGS);
  }

}
