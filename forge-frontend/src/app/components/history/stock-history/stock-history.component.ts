import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stock } from 'src/app/models/Stock.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {

  selected_stocks: Stock[];
  stock_history: Map<string, Stock[]>;
  selected_asset: string = '';
  MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  constructor(private db: DatabaseService, private route: ActivatedRoute) {
    this.selected_stocks = [];
    this.stock_history = new Map<string, Stock[]>();
    this.selected_asset = this.route.snapshot.paramMap.get('name')!;
  }

  ngOnInit(): void {
    this.db.investments.subscribe(
      (data: Stock[]) => {
        this.stock_history.clear();
        this.selected_stocks = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == this.selected_asset) {
            this.selected_stocks.push(data[i]);
          }
        }
        this.selected_stocks.sort(
          (a: Stock, b: Stock) => {
            var result = (new Date(a.timestamp)).getTime() < (new Date(b.timestamp)).getTime();
            if (result) return -1;
            return 1;
          }
        )

        for (let investment of this.selected_stocks) {
          var quarter = this.getQuater(investment.timestamp);
          var month = this.getDate(investment.timestamp);
          if (this.stock_history.get(quarter) == undefined)
            this.stock_history.set(quarter, []);

          var investment_of_this_quarter = this.stock_history.get(quarter);
          investment_of_this_quarter?.push(investment);
          this.stock_history.set(quarter, investment_of_this_quarter!);
        }
        console.log(this.selected_stocks);
      }
    )
  }

  getDate(timestamp: Date) {
    return (new Date(timestamp)).getDate() + ' ' + this.MONTHS[+((new Date(timestamp)).getMonth())] + ' ' + (new Date(timestamp)).getFullYear()
  }

  getQuater(timestamp: Date) {
    return "Q" + (Math.floor(((new Date(timestamp)).getMonth()) / 3) + 1) + ' ' + (new Date(timestamp)).getFullYear()
  }

}
