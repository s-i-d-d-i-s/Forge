import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  tab=0;
  constructor(public auth:AuthenticationService,public db:DatabaseService) { }

  ngOnInit(): void {
  }

  undo_add_expense(){
    this.auth.user?.getIdToken().then(
      (data) => {
        this.db.undo_add_expense(this.auth.user!.uid,data);
      }
    )
  }

}
