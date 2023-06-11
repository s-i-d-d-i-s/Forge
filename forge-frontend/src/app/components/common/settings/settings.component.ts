import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/models/Settings.model';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';


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
  constructor(private db:DatabaseService,public router: Router) {
    this.currentSettings = new Settings();
    this.currencies = [
      'INR',
      'USD',
      'EUR'
    ];
    this.current_viewing_currency = this.db.get_viewing_currency()!;
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


  update_viewing_currency(){
      this.db.set_viewing_currency(this.current_viewing_currency)
      alert("Changed Successfully")
      this.router.navigate(["/dashboard"]).then(() => {
        location.reload();
      })
  }
}
