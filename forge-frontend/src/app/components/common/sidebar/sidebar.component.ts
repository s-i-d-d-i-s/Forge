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
    this.check_screen_width();
    window.addEventListener('resize', this.check_screen_width.bind(this));
  }

  undo_add_expense(){
    this.auth.user?.getIdToken().then(
      (data) => {
        this.db.undo_add_expense(this.auth.user!.uid,data);
      }
    )
  }

  is_mobile = false;
  is_sidebar_visible = false;

  toggleSidebar() {
    this.is_sidebar_visible = !this.is_sidebar_visible;
  }
  
  check_screen_width() {
    this.is_mobile = window.innerWidth <= 768;
    if(!this.is_mobile){
      this.is_sidebar_visible = true;
      if(this.isMobile) this.isSidebarVisible=true;
    }
  }

}
