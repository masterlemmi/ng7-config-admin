﻿import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { FormGroup, FormControl } from '@angular/forms';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;

    constructor(private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    logout() {
        this.authenticationService.logoutWithCallback( ()=> this.router.navigate(['/login']) );
    }
}