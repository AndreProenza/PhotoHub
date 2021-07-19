import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { User } from "./user"
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

  export class UserService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };

    private userUrl = "http://localhost:3080/user";
    private registerUrl = "http://localhost:3080/register";
    private loginUrl = "http://localhost:3080/login";
    private homeUrl = "http://localhost:3080/home";
    private favoritesUrl = "http://localhost:3080/favorites";

    /**
     * Get user user details to login
     * if getUserDetails returns good data means that the user exists in
     * the database
     * @param user_id
     * @returns
     */
    loginUser(username, password): any {
      return this.http.post<JSON>(`${this.loginUrl}`, {username: username, password: password});
    }
    /**
     * For Registration
     * @param user
     * @returns
     */
    createUser(user: User){
      return this.http.post<JSON>(`${this.registerUrl}`, user);
    }

    getUserAttributes(user: string): Observable<any> {
      return this.http.get<any>(this.userUrl+'/'+user)
          .pipe(catchError(this.handleError<any>('getUserPhoto')));
    }

    setUserAttributes(photo: string, desc:string, user:string): Observable<any> {
      return this.http.post<any>(this.userUrl+'/'+user, {photo: photo, desc: desc}, this.httpOptions)
          .pipe(catchError(this.handleError<any>('setUserPhoto')));
    }

    enterHome(token) {
      return this.http.get<JSON>(`${this.homeUrl}`, {headers: new HttpHeaders(
        {
        'Authorization': token
        })
      })
    }

    setToken(token : string) {
      localStorage.setItem('token', token);
    }

    deleteToken() {
      localStorage.removeItem('token');
    }

    getUserPayload() {
      var token = localStorage.getItem('token');
      if(token) {
        var userPayload = atob(token.split('.')[1]);
        return JSON.parse(userPayload);
      }
      else {
        return null;
      }
    }

    getUserNameFromPayload() {
      var payLoad = this.getUserPayload();
      if(payLoad) {
        var username = payLoad['user']['username'];
        return username;
      }
      else {
        return null;
      }
    }

    isLoggedIn() {
      var userPayload = this.getUserPayload();
      if(userPayload) {
        var username = this.getUserNameFromPayload();
        if(username) {
          return true;
        }
        return false;
      }
      else {
        return false;
      }
    }

    getUserFavorites() {
      return this.http.get<JSON>(`${this.favoritesUrl}`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

}
