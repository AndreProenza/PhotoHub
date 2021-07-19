import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Photo } from './photo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  favoritesUrl = 'http://localhost:3080/favorites';

  favoritePhoto(username: String, photoId: String): Observable<any> {
    return this.http.post<JSON>(this.favoritesUrl + '/' + photoId, {username, photoId}, this.httpOptions)
        .pipe(catchError(this.handleError<any>('favoritePhoto')));
  }

  unFavoritePhoto(username: String, photoId: String): Observable<any> {
    return this.http.delete<JSON>(this.favoritesUrl + '/' + photoId + '/' + username)
        .pipe(catchError(this.handleError<any>('unFavoritePhoto')));
  }

  isFavorite(photoId: String,username : String): Observable<any> {
    return this.http.get<JSON>(this.favoritesUrl + '/' + photoId + '/' + username)
        .pipe(catchError(this.handleError<any>('isFavorite')));
  }

  getFavoritePhotosByUser(username: String){
    return this.http.get<JSON>(this.favoritesUrl + '/' + username)
    .pipe(catchError(this.handleError<any>('photosLiked')));

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

