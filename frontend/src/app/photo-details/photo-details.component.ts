import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Photo } from '../photo';
import{ User} from '../user'
import { UserService } from '../user.service';
import { PhotosService } from '../photos.service';
import { LikeService } from '../like.service';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private photoService: PhotosService,
    private likeService: LikeService,
    private favoritesService: FavoritesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  photo?: Photo;
  id = this.route.snapshot.paramMap.get('id');
  isLiked: boolean = true;
  isFavorite: boolean = true;
  imgPhotografer?: String;
  description?: String;
  username?: String;


  ngOnInit(): void {

    this.photoService.getPhoto(this.id)
      .subscribe(photo => {
        this.photo = photo;
        //ir buscar foto de perfil e bio do utilizado

        this.userService.getUserAttributes(this.photo.user).subscribe( res => {
          this.imgPhotografer = res.img;
          this.description = res.description;
          this.username = res.user;
          }
        );

    var userString = this.userService.getUserNameFromPayload();
    this.likeService.isLiked(this.id, userString)
    .subscribe(isLiked => {
      if(isLiked.ok == 0){
        this.isLiked = true;
      }else{
        this.isLiked = false;
      }
      if(this.isLiked){
        document.getElementById("likeButton").setAttribute("style", "color:red;")
      }
      else {
        document.getElementById("likeButton").setAttribute("style", "color:rgb(25, 71, 64);")
      }
    });

    this.favoritesService.isFavorite(this.id, userString)
    .subscribe(isFavorite => {
      if(isFavorite.ok == 0){
        this.isFavorite = true;
      }else{
        this.isFavorite = false;
      }
      if(this.isFavorite){
      document.getElementById("favoriteButton").setAttribute("style", "color:rgb(255, 213, 77);")
      }
      else {
        document.getElementById("favoriteButton").setAttribute("style", "color:rgb(25, 71, 64);")
      }
    });


  });

  }

  logout() {
    this.userService.deleteToken();
    this.router.navigateByUrl("/login");
  }

  copyToClipBoard() {

    var dummy = document.createElement('input'),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    this.popUp("Link copied!");
    document.body.removeChild(dummy);

  }

  likePhoto() {
    var userString = this.userService.getUserNameFromPayload();

    if (this.isLiked){
      document.getElementById("likeButton").setAttribute("style", "color:rgb(25, 71, 64);");
      this.photo.likes-=1;
      this.isLiked = false;

      this.likeService.unLikePhoto(userString, this.photo._id)
        .subscribe();
    } else {
      document.getElementById("likeButton").setAttribute("style", "color:red;");
      this.photo.likes+=1;
      this.isLiked = true;

      this.likeService.likePhoto(userString, this.photo._id)
        .subscribe();
    }
  }

  hoverLike(event: any): void {
    if(this.isLiked) {
      event.target.style.color = "rgb(25, 71, 64)";
    } else {
      event.target.style.color = "red";
    }
  }

  resetLike(event: any): void {
    if(this.isLiked) {
      event.target.style.color = "red";
    } else {
      event.target.style.color = "rgb(25, 71, 64)";
    }
  }

  favoritePhoto() {
    if (this.isFavorite){
      document.getElementById("favoriteButton").setAttribute("style", "color:rgb(25, 71, 64);")
      this.isFavorite = false;

      var userString = this.userService.getUserNameFromPayload();
      this.favoritesService.unFavoritePhoto(userString, this.photo._id)
        .subscribe();
    } else {
      document.getElementById("favoriteButton").setAttribute("style", "color:rgba(255, 213, 77, 0.918);")
      this.isFavorite = true;
      var userString = this.userService.getUserNameFromPayload();
      this.favoritesService.favoritePhoto(userString, this.photo._id)
          .subscribe();
    }
  }

  hoverFavorite(event: any): void {
    if(this.isFavorite) {
      event.target.style.color = "rgb(25, 71, 64)";
    } else {
      event.target.style.color = "rgb(255, 213, 77)";
    }
  }

  resetFavorite(event: any): void {
    if(this.isFavorite) {
      event.target.style.color = "rgb(255, 213, 77)";
    } else {
      event.target.style.color = "rgb(25, 71, 64)";
    }
  }

  popUp(arg: string): void {
    var popup = document.getElementById("myPopup");
    popup.innerText = arg;

    if(popup.classList.contains("show")){
      popup.setAttribute("style", "opacity:0;");
      setTimeout(function f() {
        popup.setAttribute("style", "opacity:1;");
      }, 300);
    } else {
      popup.setAttribute("style", "opacity:1;");
      popup.classList.toggle("show");
    }

    window.onclick = function(event) {
      var popup = document.getElementById("myPopup");
      var button = document.getElementById("copyLink");
      if (event.target != button && popup.classList.contains("show")) {
        popup.setAttribute("style", "opacity:0;");
        setTimeout(function f() {
          popup.classList.toggle("show");
          window.onclick = null;
        }, 300);
      }
    }
  }
}
