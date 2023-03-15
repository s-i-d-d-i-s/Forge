import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/models/Settings.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  show_alert=false;
  currentSettings: Settings;
  current_viewing_currency: string;
  currencies: string[];
  constructor(private db:DatabaseService) {
    this.currentSettings = new Settings();
    this.currencies = [
      'INR',
      'EUR'
    ];
    this.current_viewing_currency = this.db.getViewingCurrency()!;
  }

  ngOnInit(): void {
    this.db.settings.subscribe(
      (data) => {
        if(data != null){
          this.currentSettings = data;
        }
      }
    )
  }

  updateSettings(){
    this.db.addSettings(this.currentSettings);
  }
  
  update_exchange_rate(){
    this.db.addSettings(this.currentSettings);
  }

  update_viewing_currency(){
      this.db.setViewingCurrency(this.current_viewing_currency);
  }
}
