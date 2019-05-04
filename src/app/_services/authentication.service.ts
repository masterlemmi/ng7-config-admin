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
                        console.log("storing session and user", user)
                    if (user && user.details.sessionId) {
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

    hello(){
        return this.http.get<any>(`${environment.apiUrl}/user`, {withCredentials: true});
    }

    loginOriginal(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
 

        return this.http.post(`${environment.apiUrl}/logout`, {}, {withCredentials: true}).subscribe(res =>{
            console.log("logout data", res);

        })

    }
}