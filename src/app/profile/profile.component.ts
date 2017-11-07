import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Course } from '../course';
import { User } from '../user';
import { UserCourse } from '../user-course'
import { Post } from '../post'

import { UserService } from '../services/user.service'
import { PostService } from '../services/post.service'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ UserService ]
})

export class ProfileComponent implements OnInit {
  user: User;
  userCourses: UserCourse[];
  posts: Post[];

  loadingUser: boolean;
  isPrivate: boolean;
  editing: boolean;

  pastCourses: Course[];
  currentCourses: Course[];
  futureCourses: Course[];

  constructor(public authService: AuthService,
              private userService: UserService,
              private postService: PostService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadingUser = true;

    if (this.authService.authenticated === true) {
      // The user path parameter is defined, so we should try to find that user.
      // NOTE: the found user can still be the same as the logged in user!
      if (this.route.params['_value'].username != null) {
        this.route.params.switchMap((params: Params) => {
          return this.userService.getUser(params['username']).valueChanges()
        }).subscribe(user => {
          // Firebase doesn't just return null but instead has a read-only property '$value'
          if (!user) {
            this.user = null;
            this.loadingUser = false;
          } else if (user.isPrivate && user.uid !== this.authService.uid) {
            this.user = null;
            this.isPrivate = true;
          } else {
            this.initializeProfile(user as User);
          }
        });
      } else {
        // It's the default /profile path, so we just show the authenticated user's profile
        this.authService.userObject.valueChanges().subscribe(user => {
          this.initializeProfile(user as User);
        });
      }
    } else {
      // The client isn't logged in, so they can't see anything
      this.user = null;
      this.loadingUser = false;
    }
  }

  initializeProfile(user: User): void {
    this.user = user;
    this.loadingUser = false;

    this.postService.getPostsByUser(this.user.uid).valueChanges()
      .subscribe(posts => {
        this.posts = posts;
      })

    this.userService.getUserCourses(this.user.uid).valueChanges()
      .subscribe(userCourses => this.initializeUserCourses(userCourses));
  }

  initializeUserCourses(userCourses: UserCourse[]): void {
    this.pastCourses = userCourses.filter(userCourse => userCourse.plannerStatus === 'past').map(userCourse => userCourse.course);
    this.currentCourses = userCourses.filter(userCourse => userCourse.plannerStatus === 'current').map(userCourse => userCourse.course);
    this.futureCourses = userCourses.filter(userCourse => userCourse.plannerStatus === 'future').map(userCourse => userCourse.course);
  }

  toggleProfileVisibility() {
    this.userService.updateUser(this.authService.uid, {isPrivate: !this.user.isPrivate});
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/community']);
  }
}
