import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


import { User } from '@app/_models';
import { UserService, AuthenticationService, ConfigService} from '@app/_services';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
 templateUrl: 'home.component.html',
 styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    configValue: string = ""

     form: FormGroup;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private configService: ConfigService,
        private formBuilder: FormBuilder
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser
        .subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
              configInput: [null, [Validators.required]]});
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }


     logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);    
    }


    get f() { return this.form.controls}

    encrypt(){
        this.configService.encrypt(this.f.configInput.value).subscribe( res => {
             this.configValue = res;
        });
    }

    decrypt(s: string){
     this.configService.decrypt(this.f.configInput.value).subscribe( res => {
             this.configValue = res;
        });
     }
}