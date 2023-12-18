import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/Account.model';
import { Expense } from '../models/Expense.model';
import { Stock } from '../models/Stock.model';
import { Settings } from '../models/Settings.model';
import { StockOverview } from '../models/StockOverview';
import { AuthenticationService } from './authentication.service';
import { AccountOverview } from '../models/AccountOverview';
import { Router } from '@angular/router';
import { Asset } from '../models/Asset.model';

const DATABASE_BASE = 'https://deoxys-prod-default-rtdb.firebaseio.com/'
var EXPENSES = DATABASE_BASE + 'users/<<uid>>/expenses.json';
var ACCOUNTS = DATABASE_BASE + 'users/<<uid>>/accounts.json';
var SETTINGS = DATABASE_BASE + 'users/<<uid>>/settings.json';
var INVESTMENTS = DATABASE_BASE + 'users/<<uid>>/investment.json';
var ASSETS = DATABASE_BASE + 'users/<<uid>>/assets.json';

export const BACKEND_URL = 'https://forge-v2.n1ghtm4re.repl.co/';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  accounts: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  settings: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());
  totalExpenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  stocks: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  stock_overview: BehaviorSubject<StockOverview[]> = new BehaviorSubject<StockOverview[]>([]);
  account_overview: BehaviorSubject<AccountOverview[]> = new BehaviorSubject<AccountOverview[]>([]);
  net_worth_history: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  liquid_net_worth_history: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  assets: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  constructor(private http: HttpClient,public router: Router) {

  }

  refreshData(userToken: string, uid: string) {
    SETTINGS = SETTINGS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;
    EXPENSES = EXPENSES.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;
    ACCOUNTS = ACCOUNTS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;
    INVESTMENTS = INVESTMENTS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;
    ASSETS = ASSETS.replace("<<uid>>", uid) + '?auth=' + userToken + '&uid=' + uid;

    this.get_settings(uid, userToken).subscribe(
      (data) => {
        this.settings.next(data);
        console.log(data);
        if(data.onboarded){
          this.get_stock_overview(uid, userToken, this.get_viewing_currency()!);
          this.get_accounts_overview(uid, userToken, this.get_viewing_currency()!);
          this.get_all_accounts(uid, userToken);
          this.get_all_expenses(uid, userToken, this.get_viewing_currency()!);
          this.get_net_worth_history(uid, userToken, this.get_viewing_currency()!);
          this.get_liquid_net_worth_history(uid, userToken, this.get_viewing_currency()!);
          this.get_all_assets(uid, userToken, this.get_viewing_currency()!);
        }else{
          console.log("User not onboarded")
          this.router.navigate(['/onboarding']);
        }
      }
    );
  }



  initialize_user(uid:string,user_token:string){
    var url = BACKEND_URL + 'initialize/' + uid + '/' + user_token;
    this.http.get(url).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }


  addExpense(expense: Expense, uid:string, user_token:string): void {
    this.http.post(EXPENSES, expense).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        this.get_all_expenses(uid,user_token,this.get_viewing_currency()!);
        this.get_accounts_overview(uid,user_token,this.get_viewing_currency()!);
      }
    )
  }

  addAccount(account: Account): void {
    this.http.post(ACCOUNTS, account).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        // TODO : this.getAllAccounts();
      }
    )
  }

  addAsset(asset: Asset): void {
    this.http.post(ASSETS, asset).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
        // TODO : this.getAllAccounts();
      }
    )
  }

  // Stock APIs

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
    this.http.get<Stock[]>(url).subscribe(
      (data) => {
        this.stocks.next(data);
      }
    );
  }

  addStock(investment: Stock) {
    this.http.post(INVESTMENTS, investment).subscribe(
      (data) => {
        console.log("POSTED SUCCESSFULLY !");
      }
    )
  }



  get_net_worth_history(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-net-worth-history/' + uid + '/' + user_token + '/' + viewingCurrency;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.net_worth_history.next(data);
      }
    )
  }

  get_liquid_net_worth_history(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-liquid-net-worth-history/' + uid + '/' + user_token + '/' + viewingCurrency;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.liquid_net_worth_history.next(data);
      }
    )
  }


  get_accounts_overview(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-accounts-overview/' + uid + '/' + user_token + '/' + viewingCurrency;
    this.http.get<AccountOverview[]>(url).subscribe(
      (response) => {
        this.account_overview.next(response);
      }
    )
  }

  get_all_accounts(uid: string, user_token: string): void {
    var url = BACKEND_URL + 'get-accounts/' + uid + '/' + user_token;
    this.http.get<Account[]>(url).subscribe(
      (data) => {
        this.accounts.next(data);
      }
    )
  }

  get_all_assets(uid: string, user_token: string, viewingCurrency:string): void {
    var url = BACKEND_URL + 'get-assets/' + uid +'/'+ user_token + '/' + viewingCurrency;
    this.http.get<Asset[]>(url).subscribe(
      (data) => {
        this.assets.next(data);
      }
    )
  }


  get_all_expenses(uid: string, user_token: string, viewingCurrency: string) {
    var url = BACKEND_URL + 'get-expenses/' + uid + '/' + user_token + '/' + viewingCurrency;
    this.http.get<Expense[]>(url).subscribe(
      (response) => {
        this.totalExpenses.next(response);
      }
    )
  }

  undo_add_expense(uid: string, user_token: string){
    var url = BACKEND_URL + 'undo-expense/' + uid + '/' + user_token;
    this.http.get<string>(url).subscribe(
      (response) => {
        alert(response);
        this.get_all_expenses(uid,user_token,this.get_viewing_currency()!);
        this.get_accounts_overview(uid,user_token,this.get_viewing_currency()!);
      }
    )
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

  get_settings(uid: string, user_token: string) {
    var url = BACKEND_URL + 'get-settings/' + uid + '/' + user_token;
    return this.http.get<Settings>(url)
  }

  mark_onboarded(uid: string, user_token: string) {
    var url = BACKEND_URL + 'mark-onboarded/' + uid + '/' + user_token;
    this.http.get<boolean>(url).subscribe(
      (data) => {
        if(data){
          alert("You've been onboarded");
          this.router.navigate(['/dashboard']).then(
            (_) => {
              window.location.reload();
            }
          );
          
        }
      }
    )
  }

}
