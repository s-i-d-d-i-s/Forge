import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Forge';

  constructor(public auth: AuthenticationService, public router: Router) {
    this.auth.uid.subscribe(
      (data) => {
        if (data.length != 0 && document.location.pathname.toString() == "/") {
          this.router.navigate(["/"]);
        }
      }
    )
  }

  ngOnInit() {

  }
}