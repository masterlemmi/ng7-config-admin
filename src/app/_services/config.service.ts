import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpErrorResponse} from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    constructor(private http: HttpClient) { }

    
    encrypt(s: string) {
        return this.http.post(`${environment.apiUrl}/encrypt`, s, {responseType: 'text', withCredentials: true}).pipe(catchError(this.handleError));
    }

    decrypt(s: string) {
        return this.http.post(`${environment.apiUrl}/decrypt`, s, {responseType: 'text', withCredentials: true}).pipe(catchError(this.handleError));;
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
 
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        
        if (error.status == 0){
          //Possible CORS
          return of(`Error ${error.message}`)
        }

        return of(
          `ERR ${error.status}: , ` +
          `${error.error}`);
      }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};

   
}