import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { Settings } from '../models/Settings.model';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
    settings: Settings | null;
    constructor(public db: DatabaseService, public router: Router) {
        this.settings = null;
        this.db.settings.subscribe(
            (response) => {
                this.settings = response;
            }
        ) 
    }

    canActivate(): boolean {

        if ( this.settings?.onboarded) {
            return true;
        } else {
            this.router.navigate(['/onboarding']);
            return false;
        }
    }
}
