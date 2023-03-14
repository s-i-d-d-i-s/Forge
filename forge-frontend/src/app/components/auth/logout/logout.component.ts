import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public auth:AuthenticationService, public router: Router) { }

  ngOnInit(): void {
    this.auth.uid.subscribe(
      (data) => {
        if (data.length == 0) {
          this.router.navigate(["/"]);
        }
      }
    )
  }

}
