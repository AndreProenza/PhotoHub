import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user'

import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private photosService: PhotosService
  ) {}

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/home");
    }
    this.user = {
      username : "",
      password : "",
      img: "",
      description:"",
    }
  }
  
  login(): void {

    //usar user service para verificar se recebeu bem
    this.userService.loginUser(this.user.username, this.user.password).subscribe(received => {
      
      var responseInString = received["message"];
      var modal = document.getElementById("modal");

      //Verificar se a message eh corret para fazer log in
      if(responseInString === "Login failed") {
        modal.style.display = "block";
        var confirm = document.getElementById("confirmar");
        document.getElementById("error").innerHTML = "Authentication failed!";
        window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
        }
        confirm.onclick = function() {
          modal.style.display = "none";
        }
      }
      else {
        var token = received["token"];
        
        if(token == undefined) {
          modal.style.display = "block";
          var confirm = document.getElementById("confirmar");
          document.getElementById("error").innerHTML = "Authentication failed!";
          window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
          }
          confirm.onclick = function() {
            modal.style.display = "none";
          }
        }
        else {
          this.userService.setToken(token);

          this.photosService.getPhotos(this.userService.getUserNameFromPayload())
          .subscribe(photos => {
            if(photos.length > 0) {
              this.router.navigateByUrl('/personalArea');
            }
            else {
              this.router.navigateByUrl('/home');
            }
          });
        }
      }
    });
  }
}
