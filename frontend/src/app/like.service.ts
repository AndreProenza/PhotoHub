import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Photo } from './photo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  likeUrl = 'http://localhost:3080/like';

  //Like photo
  likePhoto(username: String, photoId: String): Observable<any> {
    return this.http.post<JSON>(this.likeUrl + '/' + photoId, {username, photoId}, this.httpOptions)
        .pipe(catchError(this.handleError<any>('likePhoto')));
  }

  unLikePhoto(username: String, photoId: String): Observable<any> {
    return this.http.delete<JSON>(this.likeUrl + '/' + photoId + '/' + username)
        .pipe(catchError(this.handleError<any>('unLikePhoto')));
  }

  isLiked(photoId: String,username : String): Observable<any> {
    return this.http.get<JSON>(this.likeUrl + '/' + photoId + '/' + username)
        .pipe(catchError(this.handleError<any>('isLiked')));
  }

  //Get liked by user photos id List<photosId>
  getLikedPhotosByUser(username: String){
    return this.http.get<JSON>(this.likeUrl + '/' + username)
    .pipe(catchError(this.handleError<any>('photosLiked')));

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
