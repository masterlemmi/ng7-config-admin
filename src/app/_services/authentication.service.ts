import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':  'application/x-www-form-urlencoded', 'Accept': 'application/json' }),
  withCredentials: true
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    getUser(){
        return this.http.get<any>(`${environment.apiUrl}/user`, {withCredentials: true})
                .pipe(map (user =>{

                    if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    }

                return user;

                }));
    }


    login(username: string, password: string) {

        const body = new HttpParams().set('username', username).set('password', password);
        return this.http.post(`${environment.apiUrl}/login`, body.toString(), httpOptions);
    }


    logout() {
        return this.http.post(`${environment.apiUrl}/api/logout`, {}, httpOptions).subscribe(res =>{
                 // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
        })

    }


    logoutWithCallback(fn: any) {
        return this.http.post(`${environment.apiUrl}/api/logout`, {}, httpOptions).subscribe(res =>{
                 // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                fn();
        })

    }
}