import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import { Observable, of } from 'rxjs';

import { Photo } from '../photo';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.css']
})
export class PersonalAreaComponent implements OnInit {

  constructor(
    private photoService: PhotosService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  user: string;
  pfp?: string;
  userDesc: string = '';

  userPhotos?: Photo[];

  photo?: Photo;
  photos: Photo[] = [];
  tempPhotos: Photo[] = [];

  uploaded: Boolean = false;
  initGallery: Boolean = false;
  initDir: Boolean = false;

  photoTitle: string = '';
  photoDesc: string = '';
  likes: number;

  fileName: string;

  modalPhoto?: Photo;

  slideIndex = 1;
  slideUpIndex = 1;
  pos = 0;

  ngOnInit(): void {
    this.scroll();
    this.user = this.userService.getUserNameFromPayload();

    //get user profile pic
    this.userService.getUserAttributes(this.user)
        .subscribe(res => {
          this.pfp = res.img;
          this.userDesc = res.description;
        });

    //get previously uploaded photos
    this.photoService.getPhotos(this.user)
      .subscribe(photos => this.userPhotos = photos.reverse());

    document.getElementById("a2").classList.toggle("current");
  }

  logout() {
    this.userService.deleteToken();
    this.router.navigateByUrl("/login");
  }

  setPfp(): void {
    const file = (event.target as HTMLInputElement).files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onloadend = () => {
      var img = Reader.result as string;
      this.pfp = img;
    }
  }

  updateUser(): void {
    this.userService.setUserAttributes(this.pfp, this.userDesc, this.user)
        .subscribe(() => location.reload());
  }

  getFile(): void {
    const file = (event.target as HTMLInputElement).files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onloadend = () => {
      var img = Reader.result as string;
      this.photo = { img } as Photo
    }
    this.fileName = file.name;

    document.getElementById("upload").setAttribute("style", "visibility:visible;");
  }

  getDir(): void {
    this.photos = [];
    if(this.initDir){this.initDir = false};

    const dir = (event.target as HTMLInputElement).files;
    let self = this;

    for(var i = 0; i < dir.length; i++) {
      let file = dir[i];

      var Reader = new FileReader();
      Reader.readAsDataURL(file);
      Reader.onloadend = function(e) {
        var p: Photo;
        var img = e.target.result as string;
        p = { img } as Photo;
        p.title = file.name;
        self.photos.push(p);
        if(self.photos.length<=10){self.tempPhotos.push(p);}
      }
    }

    var details = document.getElementById("details");
    var upload = document.getElementById("upload");
    var photop = document.getElementsByClassName("photo-p");

    document.getElementById("photoTitle").setAttribute("style", "display: none;");
    photop[0].setAttribute("style", "display: none;");
    details.getElementsByClassName("popup")[0].setAttribute("style", "display: none;");
    details.setAttribute("style", "display: none;");

    photop[1].setAttribute("style", "margin-top: -20%;");

    document.getElementsByClassName("thumb-p")[0].innerHTML = "Upload Photos";
    upload.innerHTML = "Confirm Directory";
    upload.setAttribute("style", "visibility:visible;");
  }

  upload(): void {
    window.onclick = null;

    if(this.photo) {
      this.confirmUpload();
    } else {
      this.confirmDir();
    }
  }

  uploadDir(): void {
    this.popUp("Uploading...", -1);

    for(var i = 0; i<this.photos.length; i++) {
      this.photos[i].user = this.user;
      this.photos[i].likes = 0;
    }

    this.uploaded = true;
    this.photoService.addPhotos(this.photos)
        .subscribe(res => this.showResponse(res));
  }

  confirmDir(): void {
    if(this.uploaded){
      this.popUp("Directory already uploaded",0);
      return;
    }

    if(this.tempPhotos.length > 0) {
      this.initDir = false;
      this.tempPhotos = [];
    }

    if(this.photoDesc != '') {
      this.photos[this.slideUpIndex-1].description = this.photoDesc;
    }

    var undefined_desc = false;
    for(var i = 0; i<this.photos.length; i++) {
      if(!this.photos[i].description) {undefined_desc=true;break;}
    }

    if(undefined_desc) {
      this.openModal("Upload without a description on all your photos?");

      let self = this;

      window.onclick = null;

      document.getElementById("cancelar").onclick = function() {
        document.getElementById("modal").style.display = "none";
        document.getElementById("upload").innerHTML = "Upload";
        document.getElementById("details").setAttribute("style", "display: flex;");
        document.getElementsByClassName("photo-p")[1].innerHTML = "Add a description";
      }

      document.getElementById("confirmar").onclick = function() {
        document.getElementById("modal").style.display = "none";
        self.uploadDir();
      }
    } else {
      this.uploadDir();
    }
  }

  uploadPhoto(): void {
    if(this.photoTitle == '') {
      this.photo.title = this.fileName;
    } else {
      this.photo.title = this.photoTitle;
    }
    this.uploaded = true;

    this.photo.user = this.user;
    this.photo.likes = 0;
    this.photoService.addPhoto(this.photo)
        .subscribe(res => this.showResponse(res));
  }

  openModal(arg: string): void {
    var modal = document.getElementById("modal");
    var cancel = document.getElementById("cancelar");
    var confirm = document.getElementById("confirmar");
    var content = document.getElementById("modal-content");
    var dots = document.getElementsByClassName("dot-container");

    content.children[0].innerHTML = arg;
    modal.style.display = "block";

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    cancel.onclick = function() {
      modal.style.display = "none";
    }
    confirm.onclick = function() {
      modal.style.display = "none";
    }
  }

  confirmUpload(): void {
    if(this.uploaded){
      this.popUp("Photo already uploaded",0);
    } else if (this.confirmTextArea()) {
      return;
    } else if(this.photoDesc == '') {
      this.openModal("Upload photo without a description?");

      let self = this;
      document.getElementById("confirmar").onclick = function() {
        document.getElementById("modal").style.display = "none";
        self.uploadPhoto();
      }
    } else {
      this.photo.description = this.photoDesc;
      this.uploadPhoto();
    }
  }

  confirmTextArea(): Boolean {
    var res = false;
    if(document.getElementById("photoTitle").classList.contains("invalid")) {
      this.popUp("Please provide up to 100 characters!",1);
      res = true;
    }
    if(document.getElementById("photoDesc").classList.contains("invalid")) {
      this.popUp("Please provide up to 500 characters!",2);
      res = true;
    }

    return res;
  }

  popUp(arg: string, el:number): void {
    var popup;
    switch(el) {
      case 1:
        popup = document.getElementById("titlePopUp");
        break;
      case 2:
        popup = document.getElementById("descPopUp");
        break;
      default:
        popup = document.getElementById("uploadPopUp");
    }

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

    if(el < 0){return;}

    window.onclick = function(event) {
      var popup = document.getElementsByClassName("popuptext");
      var button = document.getElementById("upload");

      for(var i = 0; i < popup.length; i++) {

        if (event.target != button && popup[i].classList.contains("show")) {
          popup[i].setAttribute("style", "opacity:0;");
          popup[i].classList.toggle("show");
          window.onclick = null;
        }
      }

    }
  }

  checkText(event: any): void {
    var len_t = this.photoTitle.length;
    var len_d = this.photoDesc.length;

    var id = event.target.id;
    var inv = event.target.classList.contains("invalid");

    if(len_t > 100 && id == "photoTitle") {
      this.popUp("Please provide up to 100 characters!",1);
      event.target.classList.add("invalid");
      return;
    } else if(len_d > 500 && id == "photoDesc") {
      this.popUp("Please provide up to 500 characters!",2);
      event.target.classList.add("invalid");
      return;
    }

    event.target.classList.remove("invalid");

    var popup = document.getElementsByClassName("popuptext");
    for(var i = 1; i < popup.length; i++) {
      if (popup[i].classList.contains("show")) {
        popup[i].setAttribute("style", "opacity:0;");
        popup[i].classList.toggle("show");
      }
      window.onclick = null;
    }

  }

  openImage(event: any): void {
    var modal = document.getElementById("imgModal");
    var modalImg = document.getElementById("modal-image");

    var s2 = document.getElementById("modal-s2");
    var p = s2.getElementsByTagName("label");
    var textArea = s2.getElementsByTagName("textarea");

    var likes = document.getElementById("likes");
    var del = document.getElementById("deletePhoto");

    modal.style.display = "flex";
    modalImg.setAttribute("src", event.target.src);

    setTimeout(function f() {
      modalImg.setAttribute("style", "transform:scale(1);");
      textArea[0].setAttribute("style", "transform:scale(1);");
      p[0].setAttribute("style", "transform:scale(1);");
      del.setAttribute("style", "transform:scale(1);");
      likes.setAttribute("style", "transform:scale(1);");
    }, 1);

    this.modalPhoto = this.searchArray(event.target.src);

    textArea[0].innerHTML = this.modalPhoto.title;
    if(this.modalPhoto.likes == 1) {likes.innerHTML = this.modalPhoto.likes + " like &hearts;";}
    else {likes.innerHTML = this.modalPhoto.likes + " likes &hearts;";}


    var hasDesc = this.modalPhoto.description;

    if(hasDesc) {
      textArea[1].innerHTML = this.modalPhoto.description;
      textArea[1].style.visibility = "visible";
      textArea[1].style.position = "relative";
      p[1].style.visibility = "visible";
      p[1].style.position = "relative";
      setTimeout(function f() {
        textArea[1].setAttribute("style", "transform:scale(1);");
        p[1].setAttribute("style", "transform:scale(1);");
      }, 1);
    } else {
      textArea[1].style.visibility = "hidden";
      textArea[1].style.position = "absolute";
      p[1].style.visibility = "hidden";
      p[1].style.position = "absolute";
    }

    var close = document.getElementById("modalClose");
    close.onclick = function() {
      modal.style.display = "none";
      modalImg.setAttribute("style", "transform:scale(0);");
      p[0].setAttribute("style", "transform:scale(0);");
      textArea[0].setAttribute("style", "transform:scale(0);");
      del.setAttribute("style", "transform:scale(0);");
      likes.setAttribute("style", "transform:scale(0);");
      if(hasDesc) {
        textArea[1].setAttribute("style", "transform:scale(0);");
        p[1].setAttribute("style", "transform:scale(0);");
      }
    }
  }

  searchArray(search: string): Photo {
    var res = null;
    this.userPhotos.forEach(function (curr) {
      if(curr.img == search) {
        res = curr;
      }
    });
    return res;
  }

  confirmDelete(): void {
    var modal = document.getElementById("modal2");
    var cancel = document.getElementById("cancelar2");
    var confirm = document.getElementById("confirmar2");

    let self = this;

    modal.style.display = "block";

    cancel.onclick = function() {
      modal.style.display = "none";
    }
    confirm.onclick = function() {
      modal.style.display = "none";
      self.deletePhoto();
    }
  }

  deletePhoto(): void {
    this.photoService.deletePhoto(this.modalPhoto)
        .subscribe(_ => location.reload());
  }

  showResponse(arg: any): void {
    if(!arg){
      return;
    }

    var msg = document.getElementById("myMsg");
    var msgClose = document.getElementById("closeMsg");

    msg.innerText = arg.msg;

    msg.style.visibility = "visible";
    msgClose.style.visibility = "visible";

    msgClose.onclick = function()  {
      msg.style.visibility = "hidden";
      msgClose.style.visibility = "hidden";
    };

    if(arg.ok > 0){
      setTimeout(function f() {
        location.reload();
      }, 3000);
    } else {
      setTimeout(function f() {
        msg.style.visibility = "hidden";
        msgClose.style.visibility = "hidden";
      }, 5000);
      var popup = document.getElementById("uploadPopUp");
      popup.setAttribute("style", "opacity:0;");
      setTimeout(function f() {
        popup.classList.toggle("show");
      }, 300);
    }
  }

  plusSlides(n, el) {
    if(el == 0) {
      this.showSlides(this.slideIndex += n, el);
      return;
    }

    if(this.photoDesc != ''){
      this.photos[this.slideUpIndex-1].description = this.photoDesc;
    }
    this.showSlides(this.slideUpIndex += n, el);

  }

  initSlides(n, el) {
    switch(el) {
      case 0:
        if(this.initGallery) {return;}
        this.showSlides(n, el);
        this.initGallery = true;
        break;
      case 1:
        if(this.initDir) {return;}
        this.showSlides(n, el);
        this.initDir = true;
    }
  }

  showSlides(n, el) {

    if(el == 0) {
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("dot");
      var index = this.slideIndex;
    } else {
      var slides = document.getElementsByClassName("up-mySlides");
      var dots = document.getElementsByClassName("up-dot");
      var index = this.slideUpIndex;
    }

    if (n > slides.length) {index = 1}
    if (n < 1) {index = slides.length}

    var length = dots.length;
    if(dots.length > 15) {
      length = 15;
      for (var i = 15; i < dots.length; i++) {
          dots[i].setAttribute("style", "display: none;");
      }
    }

    for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute("style", "display:none;");
    }
    for (var i = 0; i < length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[index-1].setAttribute("style", "display:block;");
    dots[index-1].className += " active";

    if(el == 0){
      this.slideIndex = index;
      return;
    }

    this.slideUpIndex = index;

    //top 10 wtf moments
    setTimeout(() => {
      this.photoTitle = this.photos[index-1].title;

      if(this.photos[index-1].description){
        this.photoDesc = this.photos[index-1].description;
      } else {
        this.photoDesc = '';
      }
    }, 0);
  }

  scroll() {
    var button = document.getElementById("scrollButton").children[0];
    button.setAttribute("style", "opacity:0;");

    if(this.pos == 0) {
      var element = document.getElementById("start");
      this.pos += 1;
      var res = "Upload Photos &#11107;";
    } else {
      var element = document.getElementById("section2");
      this.pos -= 1;
      var res = "Your Gallery &#11105;";
    }

    //button transition
    setTimeout(function f() {
      button.innerHTML = res;
      button.setAttribute("style", "opacity:1;");
    }, 300);

    element.scrollIntoView();
  }



}
