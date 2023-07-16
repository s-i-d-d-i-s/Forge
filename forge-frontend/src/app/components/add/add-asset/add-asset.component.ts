import { Component, OnInit } from '@angular/core';
import { Asset } from 'src/app/models/Asset.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {
  asset = <Asset>{};
  show_alert=false;
  constructor(private db: DatabaseService) { }
  currency_types = [
    'INR',
    'EUR',
    'USD'
  ]
  ngOnInit(): void {
    this.asset.price=0;
    this.asset.name="";
    this.asset.currency = this.currency_types[0];
    this.asset.timestamp = new Date(Date.now());
  }

  addAsset(){
    this.db.addAsset(this.asset);
    this.show_alert = true;
    this.ngOnInit();
    setTimeout(() => {
      this.show_alert = false;
    }, 2000);
  }
}
