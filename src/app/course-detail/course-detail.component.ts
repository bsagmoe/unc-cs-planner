import { Input, Component, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import 'rxjs/add/operator/switchMap'

import { CourseService } from '../services/course.service'
import { PostService } from '../services/post.service'
import { UserContextService } from '../services/user-context.service'
import { UserService } from '../services/user.service'

import { Course } from '../course'
import { Post } from '../post'

export type PlannerStatus =
  "past"
  | "current"
  | "future"
  | "none"

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
  providers: [ CourseService, UserService ]
})

export class CourseDetailComponent implements OnInit {

  course: Course;           // The course itself
  posts: Post[];            // Relevant posts
  searchFinished: boolean;  // Used for displaying a progress bar

  isPastCourse: boolean;    // These three are used for the planner selector
  isCurrentCourse: boolean;
  isFutureCourse: boolean;

  constructor(private postService: PostService,               // Gets the relevant posts
              private userContextService: UserContextService, // Lots of things
              private userService: UserService,               // Gets/updates the user's information
              private courseService: CourseService,           // Loads the course details
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.searchFinished = false;

    // Dynamically load content depending on what the current URL is using switchMap
    this.route.params.switchMap((params: Params) => {
      if(params['modifier']){
        // If there is a modifier such as 'H' for honors or 'L' for lab, react appropriately
        return this.courseService.getCourseWithModifier(String(params['dept']), Number(params['number']), String(params['modifier']));
      } else {
        // It's the 'main' course for the given number
        return this.courseService.getCourse(String(params['dept']), Number(params['number']))
      }
    }).subscribe( course => { 
      // The current course of the CourseDetailComponent is the result
      this.course = course;

      // Sort the offerings in reverse chronological order!
      this.course.offerings.sort((a, b) => {
        if(a.year < b.year) return 1
        else if(a.year > b.year) return -1
        else { // a.year == b.year
          if(a.semester === 'fall' && b.semester === 'fall' || a.semester === 'spring' && b.semester === 'spring'){
            return 0;
          } else if(a.semester === 'fall' && b.semester === 'spring'){
            return -1;
          } else {
            return 1;
          }
        }
      })
      
      // Used for displayig a progress bar
      this.searchFinished = true;

      // See if the user has added the course to their planner anywhere
      let user = this.userContextService.getCurrentUser();

      this.isPastCourse = false;
      this.isCurrentCourse = false;
      this.isFutureCourse = false;

      if(user){
        user.courses.past.forEach(course => {
          if(course._id === this.course._id){
            this.isPastCourse = true;
          }
        });

        user.courses.current.forEach(course => {
          if(course._id === this.course._id){
            this.isCurrentCourse = true;
          }
        });

        user.courses.future.forEach(course => {
          if(course._id === this.course._id){
            this.isFutureCourse = true;
          }
        });
      }

      // Get the posts relevant to the current course
      this.postService.getPostsWithTags([this.course.dept + " " + this.course.number ])
        .then(posts => { 
          this.posts = posts;
      }).catch()
    })

  }
  
  // Only used by logged-in users.
  updatePlanner(status: PlannerStatus, shouldToggle: boolean){

    // If the button being clicked is the same one as is already active, we should remove the course from the planner
    status = shouldToggle ? 'none' : status

    this.userService.updateUserCourses(this.course._id, status)
      .then(res => {
        
        switch(status){
          case 'past':
            this.isPastCourse = !this.isPastCourse;
            this.isCurrentCourse = false;
            this.isFutureCourse = false;
            break;
          case 'current':
            this.isPastCourse = false;
            this.isCurrentCourse = !this.isCurrentCourse;
            this.isFutureCourse = false;
            break;
          case 'future':
            this.isPastCourse = false;
            this.isCurrentCourse = false;
            this.isFutureCourse = !this.isFutureCourse;
            break;
          default:         
            this.isPastCourse = false;
            this.isCurrentCourse = false;
            this.isFutureCourse = false;
            break;
        }

        this.userContextService.setCurrentUser(res);
      })
      .catch();
  }

}


