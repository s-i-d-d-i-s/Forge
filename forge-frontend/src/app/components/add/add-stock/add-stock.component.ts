import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/Stock.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {
  stock = <Stock>{};
  show_alert=false;
  constructor(private db:DatabaseService) {
    
  }

  ngOnInit(): void {
    this.stock.amount=0;
    this.stock.name="";
    this.stock.timestamp = new Date(Date.now());
  }

  addStock(){
    this.db.addStock(this.stock);
    this.ngOnInit();
    setTimeout(() => {
      this.show_alert = false;
    }, 2000);
  }

}
