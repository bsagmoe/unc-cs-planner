import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Course } from '../course';
import { User } from '../user';
import { Post } from '../post'

import { UserContextService } from '../services/user-context.service';
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ UserService ]
})

export class ProfileComponent implements OnInit {

  constructor(private userContextService: UserContextService,
              private userService: UserService,
              private http: Http,
              private router: Router,
              private route: ActivatedRoute) {}

  user: User;
  userString: string;
  posts: Post[];

  pastCourses: Course[];
  currentCourses: Course[];
  futureCourses: Course[];

  ngOnInit(): void {
    let currentUser = this.userContextService.getCurrentUser()
    // If the user is logged in and the profile there are viewing is their own,
    // use the data we already have in localStorage
    if(currentUser && String(this.route.params['_value'].username) === currentUser.username){
      this.initializeProfile(currentUser)
    } else {
      // Using a switchMap guarantees the correct changes are made if you are looking
      // at a different person's profile and click on the profile nav tab (i.e. go to your own)
      this.route.params.switchMap((params: Params) => {
        return this.userService.getUser(String(params['username']))
      }).subscribe(user => this.initializeProfile(user))
    }
  }

  initializeProfile(user: User): void{
    this.user = user; 
    this.userString = this.getUserString();
    this.userService.getUserPosts(this.user._id).then(posts => this.posts = posts);
    
    this.pastCourses = this.user.courses.past;
    this.currentCourses = this.user.courses.current;
    this.futureCourses = this.user.courses.future;
  }

  getUserString(): string {
     if (!this.user) {
        return;
     } else if (this.user.name['first'] && this.user.name['last']){
        return this.user.name['first'] + " " + this.user.name['last'];
    } else {
        return this.user.username;
    }
  }
  
  logout(){
    console.log("logging out")
    this.http.get('http://localhost:3000/logout').subscribe(res => {console.log(res)});
    this.userContextService.logoutUser();
    this.router.navigate(['/community']);
  }  
}
