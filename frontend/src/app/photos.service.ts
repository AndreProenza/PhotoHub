import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Photo } from './photo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PhotosService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  photoUrl = 'http://localhost:3080/photo/personalArea';
  homeUrl = 'http://localhost:3080/photo/home';
  photoDetailsUrl = 'http://localhost:3080/photo/photoDetails';

  /** POST: add a photo to server */
  addPhoto(photo: Photo): Observable<any> {
    return this.http.post<Photo>(this.photoUrl, photo, this.httpOptions)
        .pipe(catchError(this.handleError<any>('addPhoto')));
  }

  addPhotos(photos: Photo[]): Observable<any> {
    return this.http.post<Photo[]>(this.photoUrl + '/dir', photos, this.httpOptions)
        .pipe(catchError(this.handleError<any>('addPhotos')));
  }

  //Get photo to photoDetails
  getPhoto(photoId: String): Observable<Photo> {
    return this.http.get<Photo>(this.photoDetailsUrl + '/' + photoId)
        .pipe(catchError(this.handleError<any>('getPhoto')));
  }

  getPhotos(user: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.photoUrl+'/'+user)
        .pipe(catchError(this.handleError<any>('getPhotos')));
  }

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.homeUrl)
        .pipe(catchError(this.handleError<any>('getAllPhotos')));
  }

  deletePhoto(photo: Photo): Observable<any> {
    return this.http.delete<Photo>(this.photoUrl+'/'+photo._id, this.httpOptions)
        .pipe(catchError(this.handleError<any>('deletePhotos')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
