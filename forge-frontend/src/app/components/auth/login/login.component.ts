import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth:AuthenticationService, public router: Router) { }

  ngOnInit(): void {
    this.auth.uid.subscribe(
      (data) => {
        if (data.length != 0) {
          this.router.navigate(["/dashboard"]).then(() =>{
            location.reload();
          });
        }
      }
    )
  }
}
