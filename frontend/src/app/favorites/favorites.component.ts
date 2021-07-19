import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { PhotosService } from '../photos.service';
import { Photo } from '../photo';
import { Likes } from '../likes';
import { Favorites } from '../favorites';
import { LikeService } from '../like.service';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    private photoService: PhotosService,
    private likeService: LikeService,
    private favoritesService: FavoritesService,
  ) {}

  photos?: Photo[];
  likedPhotos?:Likes[]; //lista de photoId
  favoritePhotos?:Favorites[];
  //lista de fotos gostadas
  mapPhoto_Like?:Map<Photo,Boolean>; //True se tem Like
  photo: Photo;

  clicked = false;

  ngOnInit(): void {
    this.mapPhoto_Like = new Map();
    var currentUser = this.userService.getUserNameFromPayload();
    this.favoritesService.getFavoritePhotosByUser(currentUser)
      .subscribe(favoritePhotos => {
        this.favoritePhotos = favoritePhotos;//lista de fotos favoritas
        this.likeService.getLikedPhotosByUser(currentUser)
        .subscribe(likedPhotos => {
            this.likedPhotos = likedPhotos; //lista fotos gostadas
            this.favoritePhotos.forEach( fav => {
              var temLike = false;
              this.likedPhotos.forEach ( like => {
                if(like.user === fav.user && like.photoId === fav.photoId) {
                  temLike = true;
                }
              });
              this.photoService.getPhoto(fav.photoId).subscribe (photo => {
              this.mapPhoto_Like.set(photo,temLike);

              });


            });

        });

      });

    document.getElementById("a3").classList.toggle("current");
  }

  logout() {
    this.userService.deleteToken();
    this.router.navigateByUrl("/login");
  }

  hoverPhoto(event: any): void {
    event.target.setAttribute("style", "transform: scale(1.2)");
  }

  resetPhoto(event: any): void {
    event.target.setAttribute("style", "transform: scale(1)");
  }

  hover(event: any, photo: Photo): void {
    if(this.clicked) {
      this.clicked = false;
      event.target.setAttribute("style", "transform: scale(1.5);");

      setTimeout(function f() {
        event.target.setAttribute("style", "transform: scale(1);");
      }, 300);
      return;
    }

    var likes = photo.likes;
    if(event.target.classList.contains("active")) {
      likes--;
      event.target.innerHTML = likes + "&nbsp;" + "&#9825;";
    } else {
      likes++;
      event.target.innerHTML = likes + "&nbsp;" + "&#9829;";
    }
    event.target.setAttribute("style", "transform: scale(1.1)");
  }

  reset(event: any, photo: Photo) {
    if(event.target.classList.contains("active")) {
      event.target.innerHTML = photo.likes + "&nbsp;" + "&#9829;";
    } else {
      event.target.innerHTML = photo.likes + "&nbsp;" + "&#9825;";
    }
    event.target.setAttribute("style", "transform: scale(1)");
  }

  select(event: any, photo: Photo): void {

    var userString = this.userService.getUserNameFromPayload();

    var likes = photo.likes;
    if(event.target.classList.contains("active")) {
      likes--;
      this.likeService.unLikePhoto(userString, photo._id).subscribe();
    } else {
      likes++;
      this.likeService.likePhoto(userString, photo._id).subscribe();
    }

    event.target.classList.toggle("active");

    var isLiked = !this.mapPhoto_Like.get(photo);
    this.mapPhoto_Like.set(photo, isLiked);
    photo.likes = likes;

    this.clicked = true;
  }

  redirect(photo: Photo) {
    this.router.navigateByUrl(`/photoDetails/${photo._id}`);
  }

}
