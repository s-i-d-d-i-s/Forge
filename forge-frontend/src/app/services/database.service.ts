import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/Account.model';
import { Expense } from '../models/Expense.model';
import { Stock } from '../models/Stock.model';
import { Settings } from '../models/Settings.model';
import { StockOverview } from '../models/StockOverview';
import { AuthenticationService } from './authentication.service';

const DATABASE_BASE = 'https://deoxys-prod-default-rtdb.firebaseio.com/'
var EXPENSES = DATABASE_BASE + 'users/<<uid>>/expenses.json';
var ACCOUNTS = DATABASE_BASE + 'users/<<uid>>/accounts.json';
var SETTINGS = DATABASE_BASE + 'users/<<uid>>/settings.json';
var INVESTMENTS = DATABASE_BASE + 'users/<<uid>>/investment.json';

const BACKEND_URL = 'http://localhost:5000/';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  totalExpenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  accounts: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  investments: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  settings: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());

  stock_overview: BehaviorSubject<StockOverview[]> = new BehaviorSubject<StockOverview[]>([]);

  constructor(private http: HttpClient) {

  }

  refreshData(userToken: string, uid: string) {
    SETTINGS = SETTINGS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;
    EXPENSES = EXPENSES.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;;
    ACCOUNTS = ACCOUNTS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;;
    INVESTMENTS = INVESTMENTS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;;

    this.get_stock_overview(uid, userToken, this.get_viewing_currency()!);


    this.getSettings().subscribe(
      (data) => {
        console.log(data);
        if (data != null) {
          this.settings.next(data);
          this.getAllExpense();

        }
        this.getAllAccounts();
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
    var viewingCurrency = this.get_viewing_currency();
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

  addStock(investment: Stock) {
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


  get_stock_overview(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-stock-overview/' + uid + '/' + user_token + '/' + viewingCurrency;
    this.http.get<StockOverview[]>(url).subscribe(
      (response) => {
        this.stock_overview.next(response);
      }
    )
  }

  get_stock_history(uid: string, user_token: string, symbol: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-stock-history/' + uid + '/' + user_token + '/' + viewingCurrency + "/" + symbol;
    return this.http.get<{ [quater: string]: Stock[] }>(url);
  }

  get_stock_list(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-stock-list/' + uid + '/' + user_token + '/' + viewingCurrency;
    return this.http.get<Stock[]>(url);
  }

  set_viewing_currency(currency: string) {
    localStorage.setItem("View_Currency", currency);
  }
  get_viewing_currency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }

  toggleGraphMode() {
    var currentMode = this.getGraphMode();
    localStorage.setItem("Graph_With_Investment", currentMode == 'false' ? 'true' : 'false');
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
