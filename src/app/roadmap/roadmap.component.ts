import { Component, OnInit } from '@angular/core';

import { CourseService } from '../services/course.service'
import { AuthService } from '../services/auth.service'
import { UserService } from '../services/user.service'

import { Course } from '../course'
import { User } from '../user'
import { UserCourse } from '../user-course'

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  providers: [ CourseService ]
})

export class RoadmapComponent implements OnInit {

  currentSemester = 'spring';
  currentYear = 2018;

  currentUser: User;

  hideInfrequent: boolean;
  showOnlyUpcoming: boolean;
  showGradCourses: boolean;

  coursePlan: string;

  coreCourses: Course[];
  coreCoursesBs: Course[];
  compCourses: Course[];
  outsideBa: Course[];
  outsideBs: Course[];

  filteredCore: Course[];
  filteredComp: Course[];
  filteredOutside: Course[];

  coreCompleted: number;
  compCompleted: number;
  outsideBaCompleted: number;
  outsideBsCompleted: number;

  constructor(private courseService: CourseService,
              public authService: AuthService,
              private userService: UserService) { }

  setCoursePlan(coursePlan: string): void {
    sessionStorage.setItem('coursePlan', coursePlan)
    this.coursePlan = coursePlan;
    this.setCourses();
  }

  setCourses() {
    this.filteredComp = this.filterCourses(this.compCourses);

    switch (this.coursePlan) {
      case 'ba':
        this.filteredCore = this.filterCourses(this.coreCourses);
        this.filteredOutside = this.filterCourses(this.outsideBa);
        break;
      case 'bs':
        this.filteredComp = this.filteredComp.filter(course => !(course.number === 455 || course.number === 550))
        this.filteredCore = this.filterCourses(this.coreCoursesBs);
        this.filteredOutside = this.filterCourses(this.outsideBs);
        break;
      case 'minor':
        this.filteredCore = this.filterCourses(this.coreCourses);
        break;
    }
  }

  filterCourses(courses: Course[]) {
    if (courses) {
      const infrequentFiltered = courses.         filter(course => (!this.hideInfrequent || !course.semesters.includes('infreqent')))
      const upcomingFiltered = infrequentFiltered.filter(course => !(this.showOnlyUpcoming && !this.hasCurrentOffering(course)) )
      const gradFiltered = upcomingFiltered.      filter(course => this.showGradCourses || course.number < 700)
      return gradFiltered;
    } else {
      return null;
    }
  }

  hasCurrentOffering(course: Course): boolean {
    let result = false;
    course.offerings.forEach(offering => {
      if (offering.semester === this.currentSemester && offering.year === this.currentYear ) {
        result = true;
      };
    })

    return result;
  }

  toggleHideInfrequent() {
    this.hideInfrequent = !this.hideInfrequent;
    sessionStorage.setItem('hideInfrequent', JSON.stringify(this.hideInfrequent));
    this.setCourses();
  }

  toggleShowOnlyUpcoming() {
    this.showOnlyUpcoming = !this.showOnlyUpcoming;
    sessionStorage.setItem('showOnlyUpcoming', JSON.stringify(this.showOnlyUpcoming));
    if (this.showOnlyUpcoming && this.hideInfrequent) { this.toggleHideInfrequent() };
    this.setCourses();
  }

  toggleShowGradCourses() {
    sessionStorage.setItem('showGradCourses', JSON.stringify(!this.showGradCourses));
    this.showGradCourses = !this.showGradCourses;
    this.setCourses();
  }

  ngOnInit() {
    // Restore any state we have stored
    this.coursePlan = sessionStorage.getItem('coursePlan') || 'bs';
    this.hideInfrequent = JSON.parse(sessionStorage.getItem('hideInfrequent')) || false;
    this.showOnlyUpcoming = JSON.parse(sessionStorage.getItem('showOnlyUpcoming')) || false;
    this.showGradCourses = JSON.parse(sessionStorage.getItem('showGradCourses')) || false;

    // This is really ugly, but it works for now
    // TODO: Make this nicer to work with
    // Basically, we check if there is a cached version of the course list so I don't waste
    // tons of reads by reloading the course data every time. In the future, I'll
    // add something to the courses/{dept} document that this will check to see if it should invalidate the cache
    let core, coreBs, comp, outsideBa, outsideBs;

    if (sessionStorage.getItem('coreCourses')) {
      core = Promise.resolve( JSON.parse(sessionStorage.getItem('coreCourses')) as Course[])
        .then(courses => this.coreCourses = courses)
    } else {
      core = this.courseService.getCoursesInRange('COMP', 401, 411)
        .valueChanges().take(1).toPromise()
        .then(courses => {
          this.coreCourses = courses
          sessionStorage.setItem('coreCourses', JSON.stringify(courses))
        })
    }

    if (sessionStorage.getItem('coreCoursesBs')) {
      coreBs = Promise.resolve( JSON.parse(sessionStorage.getItem('coreCoursesBs')) as Course[])
        .then(courses => this.coreCoursesBs = courses)
    } else {
      coreBs = this.courseService.getCourseBatch(['COMP 401', 'COMP 410', 'COMP 411', 'COMP 455', 'COMP 550'])
        .then(courses => {
          this.coreCoursesBs = courses
          sessionStorage.setItem('coreCoursesBs', JSON.stringify(courses))
        })
    }

    if (sessionStorage.getItem('compCourses')) {
      comp = Promise.resolve( JSON.parse(sessionStorage.getItem('compCourses')) as Course[])
        .then(courses => this.compCourses = courses)
    } else {
      comp = this.courseService.getCoursesInRange('COMP', 426, 999)
        .valueChanges().take(1).toPromise()
        .then(courses => {
          this.compCourses = courses
          sessionStorage.setItem('compCourses', JSON.stringify(courses))
        })
    }

    if (sessionStorage.getItem('outsideBa')) {
      outsideBa = Promise.resolve( JSON.parse(sessionStorage.getItem('outsideBa')) as Course[])
        .then(courses => this.outsideBa = courses)
    } else {
      outsideBa = this.courseService.getCourseBatch(['COMP 283', 'MATH 381', 'STOR 155', 'STOR 435'])
        .then(courses => {
          this.outsideBa = courses
          sessionStorage.setItem('outsideBa', JSON.stringify(courses))
        })
    }

    if (sessionStorage.getItem('outsideBs')) {
      outsideBs = Promise.resolve( JSON.parse(sessionStorage.getItem('outsideBs')) as Course[])
        .then(courses => this.outsideBs = courses)
    } else {
      outsideBs = this.courseService.getCourseBatch(['COMP 283', 'MATH 381', 'MATH 547', 'PHYS 118', 'STOR 435'])
        .then(courses => {
          this.outsideBs = courses
          sessionStorage.setItem('outsideBs', JSON.stringify(courses))
        })
    }

    Promise.all([core, coreBs, comp, outsideBa, outsideBs])
      .then( _ => {
        this.setCoursePlan(this.coursePlan)
      })
  }

  courseSort = function(course_a, course_b): number {
    if (course_a.dept < course_b.dept) {
      return -1
    } else if (course_a.dept === course_b.dept) {
      if (course_a.number < course_b.number) {
        return -1
      } else if (course_a.number === course_b.number) {
        return 0;
      } else {
        return 1
      }
    } else {
      return 1
    }
  }

}
