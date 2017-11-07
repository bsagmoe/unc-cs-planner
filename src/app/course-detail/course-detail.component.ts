import { Input, Component, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import 'rxjs/add/operator/switchMap'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database'

import { CourseService } from '../services/course.service'
import { PostService } from '../services/post.service'
import { AuthService } from '../services/auth.service'
import { UserService } from '../services/user.service'


import { Course } from '../course'
import { Post } from '../post'
import { User } from '../user'
import { UserCourse, PlannerStatus } from '../user-course'

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
  providers: [ CourseService, UserService, AuthService ]
})

export class CourseDetailComponent implements OnInit {

  userCourses: UserCourse[];
  courseKey: string;
  course: Course;           // The course itself
  posts: Post[];            // Relevant posts
  searchFinished: boolean;  // Used for displaying a progress bar

  isPastCourse: boolean;    // These three are used for the planner selector
  isCurrentCourse: boolean;
  isFutureCourse: boolean;

  constructor(private postService: PostService,               // Gets the relevant posts
              public authService: AuthService,
              private userService: UserService,               // Gets/updates the user's information
              private courseService: CourseService,           // Loads the course details
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.searchFinished = false;
    this.isPastCourse = false;
    this.isCurrentCourse = false;
    this.isFutureCourse = false;

    // Dynamically load content depending on what the current URL is using switchMap
    this.route.params.switchMap((params: Params) => {
      if (params['modifier']) {
        // If there is a modifier such as 'H' for honors or 'L' for lab, react appropriately
        return this.courseService.getCourseWithModifier(String(params['dept']), Number(params['number']), String(params['modifier']))
          .valueChanges();
      } else {
        // It's the 'main' course for the given number
        return this.courseService.getCourse(String(params['dept']), Number(params['number'])).valueChanges()
      }
    }).subscribe( course => {
      // The current course of the CourseDetailComponent is the result
      this.course = course as Course;

      // Sort the offerings in reverse chronological order!
      this.course.offerings.sort((a, b) => {
        if (a.year < b.year) {
          return 1
        } else if (a.year > b.year) {
          return -1
        } else { // a.year == b.year
          if (a.semester === 'fall' && b.semester === 'fall' || a.semester === 'spring' && b.semester === 'spring') {
            return 0;
          } else if (a.semester === 'fall' && b.semester === 'spring') {
            return -1;
          } else {
            return 1;
          }
        }
      })

      // Used for displayig a progress bar
      this.searchFinished = true;

      this.postService.getPostsWithTag(this.course.dept + this.course.number).valueChanges()
        .subscribe(posts => this.posts = posts.reverse());


      // See if the user has added the course to their planner anywhere
      if (this.authService.authenticated) {
        this.authService.afAuth.authState.subscribe(user => {
          this.userService.getUserCourses(user.uid).valueChanges().subscribe(userCourses => {
            this.userCourses = userCourses as UserCourse[];

            this.userCourses.forEach(userCourse => {
              localStorage.setItem(userCourse.course.dept + userCourse.course.number + userCourse.course.modifier,
                                     userCourse.plannerStatus);
            })

            this.userCourses.forEach(userCourse => {
              if (userCourse.course.dept === this.course.dept && userCourse.course.number === this.course.number) {
                this.isPastCourse = userCourse.plannerStatus === 'past';
                this.isCurrentCourse = userCourse.plannerStatus === 'current';
                this.isFutureCourse = userCourse.plannerStatus === 'future';
              }
            });
          });
        });
      }
    })

  }

  // Only used by logged-in users.
  updatePlanner(status: PlannerStatus, shouldToggle: boolean) {

    // If the button being clicked is the same one as is already active, we should remove the course from the planner
    status = shouldToggle ? 'none' : status

    if (status === 'none') {
      this.userService.removeUserCourse(this.authService.uid, this.course).then( _ => {
        this.isPastCourse = false;
        this.isCurrentCourse = false;
        this.isFutureCourse = false;
      });
      localStorage.removeItem(this.course.dept + this.course.number + this.course.modifier);
    } else {
      this.userService.updateUserCourses(this.authService.uid, this.course, status, this.courseKey);
      localStorage.setItem(this.course.dept + this.course.number + this.course.modifier, status);
    }
  }

}


