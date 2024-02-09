import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stock } from 'src/app/models/Stock.model';
import { StockOverview } from 'src/app/models/StockOverview';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {

  selected_stocks: {[quater:string]: Stock[]};
  selected_stock: string = '';
  uid = '';
  user_token = '';
  constructor(private db: DatabaseService, private route: ActivatedRoute, public auth:AuthenticationService) {
    this.selected_stocks = {};
    this.selected_stock = this.route.snapshot.paramMap.get('name')!;
    this.auth.uid.subscribe(
      (_uid) =>{ this.uid = _uid;}
    );
    this.auth.user_token.subscribe(
      (_user_token) =>{ this.user_token = _user_token;}
    );
  }

  ngOnInit(): void {
    this.db.stock_overview.subscribe(
      (overview:StockOverview[]) => {
          for(let stock of overview){
            if(stock.name == this.selected_stock){
              this.db.get_stock_history(this.uid,this.user_token, stock.symbol, this.db.get_viewing_currency()!).subscribe(
                (response) => {
                  this.selected_stocks = response;
                }
              );
              break;
            }
          }
      }
    )
    
 
  }
 
}
