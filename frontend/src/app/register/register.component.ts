import { Component, OnInit } from '@angular/core';
import { User } from "../user";
import { Router } from '@angular/router';
import { UserService} from "../user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/home");
    }
    this.user = {
      username: "",
      password :"",
      img:"",
      description:"",
    }
    this.hideRequirements();
  }

  register(){

    var modal = document.getElementById("modal");
     this.userService.createUser(this.user).subscribe(res => {

      var responseInString = res["message"];

      if( responseInString === "User added" ) {

        this.userService.loginUser(this.user.username, this.user.password).subscribe(received => {
      
          var responseInString = received["message"];
          var modal = document.getElementById("modal");
    
          if(responseInString === "Login failed") {
            modal.style.display = "block";
            var confirm = document.getElementById("confirmar");
            document.getElementById("error").innerHTML = "Registration failed!";
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
              document.getElementById("error").innerHTML = "Registration failed!";
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
              
              modal.style.display = "block";
              var confirm = document.getElementById("confirmar");
              document.getElementById("error").innerHTML = "You have been successfully registered";
              window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                  location.reload();
                }
              }
              confirm.onclick = function() {
                modal.style.display = "none";
                location.reload();
              }
              confirm.onkeypress = function() {
                modal.style.display = "none";
                location.reload();
              }
            }
          }
        });
      }
      else if (responseInString === "User exists"){
        modal.style.display = "block";
        var confirm = document.getElementById("confirmar");
        document.getElementById("error").innerHTML = "Username already exists";
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
        modal.style.display = "block";
        var confirm = document.getElementById("confirmar");
        document.getElementById("error").innerHTML = "Intern Error creating User";
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
        confirm.onclick = function() {
          modal.style.display = "none";
        }
      }
     
    }
    )
  }

  verifyField(){
    var myPassword : any = document.getElementById('password');
    var size : any = document.getElementById('size');
    var capital : any = document.getElementById('capital');
    var small : any = document.getElementById('small');
    var number : any = document.getElementById('number');

    // Validate lowercase letters
   var lowerCaseLetters = /[a-z]/g;
   if (myPassword.value.match(lowerCaseLetters)) {
      small.classList.remove("invalid");
      small.classList.remove("incorrect");
      small.classList.add("valid");
   }else {
  
      small.classList.remove("valid");
      small.classList.add("invalid");
   }

   //ver se contem numeros
   var numbers = /[0-9]/g;
   if (myPassword.value.match(numbers)) {
   
    number.classList.remove("incorrect");
    number.classList.remove("invalid");
    number.classList.add("valid");
  }else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  //ver tamanho
  if(myPassword.value.length >= 8) {
    size.classList.remove("incorrect");
    size.classList.remove("invalid");
    size.classList.add("valid");
  }else {
    size.classList.remove("valid");
    size.classList.add("invalid");
  }

  var upperCaseLetters = /[A-Z]/g;
  if (myPassword.value.match(upperCaseLetters)) {
    capital.classList.remove("incorrect");
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  }else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  }

  displayRequirements(){
    document.getElementById('password-requirements').style.visibility = "visible";
  }

  hideRequirements(){
    document.getElementById('password-requirements').style.visibility = "hidden";
  }

  verificarTudo(){
    var myUsername : any = document.getElementById('username');
    var myPassword : any = document.getElementById('password');
    var size : any = document.getElementById('size');
    var capital : any = document.getElementById('capital');
    var small : any = document.getElementById('small');
    var number : any = document.getElementById('number');
    var n : number = 0;
    var modal = document.getElementById("modal");
  

    // Validate lowercase letters
   var lowerCaseLetters = /[a-z]/g;
   if (myPassword.value.match(lowerCaseLetters)) {
      // small.classList.remove('incorrect');
      // small.classList.remove("invalid");
      // small.classList.add("valid");
      small.classList.remove("incorrect");
      small.classList.add("invalid");
      n++;
   }else {
      // small.classList.remove("valid");
      // small.classList.add("incorrect");
      small.classList.remove("invalid");
      small.classList.add("incorrect");
   }

   //ver se contem numeros
   var numbers = /[0-9]/g;
   if (myPassword.value.match(numbers)) {
    // number.classList.remove('incorrect');
    // number.classList.remove("invalid");
    // number.classList.add("valid");
    number.classList.remove("incorrect");
    number.classList.add("invalid");
    n++;
  }else {
    // number.classList.remove("valid");
    // number.classList.add("incorrect");
    number.classList.remove("invalid");
    number.classList.add("incorrect");
  }

  //ver tamanho
  if(myPassword.value.length >= 8) {
    // size.classList.remove('incorrect');
    // size.classList.remove("invalid");
    // size.classList.add("valid");
    size.classList.remove("incorrect");
    size.classList.add("invalid");
    n++;
  }else {
    // size.classList.remove("valid");
    // size.classList.add("incorrect");
    size.classList.remove("invalid");
    size.classList.add("incorrect");
  }

  var upperCaseLetters = /[A-Z]/g;
  if (myPassword.value.match(upperCaseLetters)) {
    // capital.classList.remove('incorrect');
    // capital.classList.remove("invalid");
    // capital.classList.add("valid");
    capital.classList.remove("incorrect");
    capital.classList.add("invalid");
    n++;
  }else {
    // capital.classList.remove("valid");
    // capital.classList.add("incorrect");
    capital.classList.remove("invalid");
    capital.classList.add("incorrect");
  }

  var letterNumber = /^[0-9a-zA-Z]+$/;
  if ((myUsername.value.match(letterNumber)) && myUsername.value.length >=3 ){
    n++;
  }
  if(n==5) {
    this.register();
  }
  else {
    modal.style.display = "block";
    var confirm = document.getElementById("confirmar");
    document.getElementById("error").innerHTML = "Registration Failed!\n" + 
    "Please ensure username has 3 or more characters, containing only letters and/or numbers.\n" + 
    "Also ensure the password requirements are correct!";
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    confirm.onclick = function() {
      modal.style.display = "none";
    }
  }
 }



}
