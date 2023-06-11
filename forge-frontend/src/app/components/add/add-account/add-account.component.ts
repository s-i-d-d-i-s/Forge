import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  show_alert = false;
  account = <Account>{};
  constructor(private db: DatabaseService) { }

  currency_types = [
    'INR',
    'EUR',
    'USD'
  ]
  ngOnInit(): void {
    this.account.closed=false;
    this.account.currency = this.currency_types[0];
  }

  addAccount() {
    this.db.addAccount(this.account);
    this.account.name="";
    this.account.currency="";
    setTimeout(() => {
      this.show_alert = false;
    }, 2000);
  }


}
