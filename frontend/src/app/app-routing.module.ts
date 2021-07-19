import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { PersonalAreaComponent } from "./personal-area/personal-area.component";
import { PhotoDetailsComponent } from "./photo-details/photo-details.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { AuthGuard } from './auth/auth.guard'

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent},
  { path: "home", component: HomeComponent, canActivate:[AuthGuard]},
  { path: "personalArea", component: PersonalAreaComponent, canActivate:[AuthGuard]},
  { path: "photoDetails/:id", component: PhotoDetailsComponent, canActivate:[AuthGuard] },
  { path: "favorites", component: FavoritesComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
