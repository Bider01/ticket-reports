import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {

        this.userSubject = new BehaviorSubject<User>(new User(localStorage.getItem('username'), localStorage.getItem('password')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login_status`, null, {headers: {username, password} })
            .pipe(map(data => {
              if (data.message === true) {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                const user: User = new User(username, password);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                localStorage.setItem('admin', data.admin);
                this.userSubject.next(user);
                return data;
              } else {
                return false;
              }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
