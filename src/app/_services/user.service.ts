import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }


    register(user: User) {
        return this.http.post(`${environment.apiUrl}/auth/register`, user);
    }

    get(id){
        return this.http.get<User>(`${environment.apiUrl}/auth/user/${id}`);     
    }

}