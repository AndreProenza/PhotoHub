import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import { Photo } from '../photo';
import { Likes } from '../likes';
import { PhotosService } from '../photos.service';
import { LikeService } from '../like.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private photoService: PhotosService,
    private likeService: LikeService,
    private router: Router
  ) {}

  photos?: Photo[];
  likedPhotos?:Likes[]; //lista de photoId
  //lista de fotos gostadas
  mapPhoto_Like?:Map<Photo,Boolean>; //True se tem Like

  mapPhoto_Show?:Map<Photo,Boolean>;
  isMenuOpen: Boolean;

  tempMap?:Map<Photo,Boolean>;
  clicked = false;


  ngOnInit(): void {
    this.photoService.getAllPhotos()
        .subscribe(photos => {
          this.mapPhoto_Like = new Map();
          this.photos = photos.reverse();
          var currentUser = this.userService.getUserNameFromPayload();
          this.likeService.getLikedPhotosByUser(currentUser)
              .subscribe(likedPhotos => {
                  this.likedPhotos = likedPhotos;
                  this.photos.forEach(photo => {
                      var found = false;
                      var photoId= photo._id;
                      this.likedPhotos.forEach(like => {
                        if(like.photoId === photoId){
                          found = true;
                          this.mapPhoto_Like.set(photo,true);
                        }
                      });
                      //caso nao encontre
                      if(!found) {
                        this.mapPhoto_Like.set(photo,false);
                      }
                  });
                  //this.mapPhoto_Show = new Map(this.mapPhoto_Like);
                  this.tempMap = new Map(this.mapPhoto_Like);
              });
      });
      this.isMenuOpen = false;
    document.getElementById("a1").classList.toggle("current");
  }

  logout(): void {
    this.userService.deleteToken();
    this.router.navigateByUrl("/login");
  }

  hoverSortMenu(): void {
    document.getElementById("dropdown-content-id").style.display = "block"
  }

  unhoverSortMenu(): void {
    document.getElementById("dropdown-content-id").style.display = "none";
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
    this.tempMap.set(photo, isLiked);
    photo.likes = likes;

    this.clicked = true;

    if(!(document.getElementById("home-title").innerHTML == "Recent Photos")){
      this.sortByLikes();
    }
  }

  redirect(photo: Photo) {
    this.router.navigateByUrl(`/photoDetails/${photo._id}`);
  }

  showPopUp() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var confirm = document.getElementById("confirmar");
    document.getElementById("error").innerHTML = "Please choose an option to sort photos!";
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    confirm.onclick = function() {
      modal.style.display = "none";
    }
  }

  sortByDate() {
    document.getElementById("home-title").innerHTML = "Recent Photos";
    this.isMenuOpen = false;
    document.getElementById("dropdown-content-id").style.display = "none"

    this.mapPhoto_Like.clear();
    setTimeout(() => {
      this.mapPhoto_Like = new Map(this.tempMap);
    }, 0);

    //location.reload();
  }

  sortByLikes() {
    document.getElementById("home-title").innerHTML = "Most Liked Photos";
    this.isMenuOpen = false;
    document.getElementById("dropdown-content-id").style.display = "none"

    if(!this.mapPhoto_Like) {return;}

    var tempList = [];
    for (var i = 0; i < this.mapPhoto_Like.size; i++) {
      var tempSubList = [];
      tempSubList.push(Array.from(this.mapPhoto_Like)[i][0].likes);
      tempSubList.push(Array.from(this.mapPhoto_Like)[i]);
      tempList.push(tempSubList);
    }
    tempList.sort();

    this.mapPhoto_Like.clear();
    for (var i = tempList.length-1; i > 0; i--) {
      this.mapPhoto_Like.set(tempList[i][1][0], tempList[i][1][1]);
    }

    setTimeout(() => {
      this.mapPhoto_Like.set(tempList[0][1][0], tempList[0][1][1]);
    }, 0);

  }

  removeExtra(): void {
    var containers = document.getElementsByClassName("photo-container");
    for(var i = 50; i < containers.length; i++) {
      containers[i].setAttribute("style", "display: none;");
    }

  }

}
