import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    // http options used for making API calls
    private httpOptions: any;

    // the actual JWT token
    private access_token: string;
    private refresh_token: string;
    
    // the token expiration date
    public token_expires: Date;
    
    // the username of the logged in user
    public username: string;
    
    // error messages received from the login attempt
    public errors: any = [];



    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          };
    }



    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    public getCurrentToken():string{
        return this.access_token
    }

    public login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.http.post(`${environment.apiUrl}/auth/token`, {username, password}).subscribe(
                    data => {
                        this.updateData(data['access']);
                        console.log("my token "+this.access_token)
                        localStorage.setItem('access_token',this.access_token)
                        localStorage.setItem('refresh_token',data['refresh'])
                        
                    },
                    err => {
                        this.errors = err['error'];
                    }
                    );
                                    
                return user;
            },
            err => {
                this.errors = err['error'];
              }));
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token')
        this.currentUserSubject.next(null);
        this.access_token = null;
        this.token_expires = null;
        this.username = null;
    }

    // Refreshes the JWT token, to extend the time the user is logged in
    public refreshToken() {
        this.http.post(`${environment.apiUrl}/auth/token/refresh`, JSON.stringify({"refresh": localStorage.getItem('refresh_token')}), this.httpOptions).subscribe(
        data => {
            this.updateData(data['access']);
            localStorage.setItem('access_token',data['access'])
        },
        err => {
            this.errors = err['error'];
        }
        );
    }

    public getToken(username: string, password: string) {
        this.http.post(`${environment.apiUrl}/auth/token`, {username, password}).subscribe(
        data => {
            this.updateData(data['access']);
        },
        err => {
            this.errors = err['error'];
        }
        );
    }

    private updateData(token) {
        this.access_token = token;
        this.errors = [];
     
        // decode the token to read the username and expiration timestamp
        const token_parts = this.access_token.split(/\./);
        const token_decoded = JSON.parse(window.atob(token_parts[1]));
        this.token_expires = new Date(token_decoded.exp * 1000);
        this.username = token_decoded.username;
      }
}