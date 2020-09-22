import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service"
import { User } from "../_models/user"
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  userDisplayName: string;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }
  ngOnInit() {
    this.userDisplayName=this.currentUser['user'].first_name+' '+this.currentUser['user'].last_name
    console.log(this.userDisplayName)

  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
