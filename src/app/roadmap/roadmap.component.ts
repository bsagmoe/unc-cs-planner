import { Component, OnInit } from '@angular/core';

import { CourseService } from '../services/course.service'

import { Course } from '../course'

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  providers: [ CourseService ]
})

export class RoadmapComponent implements OnInit {

  constructor(private courseService: CourseService) { }

  currentSemester: string = 'fall';
  currentYear: number = 2017;

  hideInfrequent: boolean;
  showOnlyUpcoming: boolean;
  showGradCourses: boolean;

  coursePlan: string;

  coreCourses: Course[];
  compCourses: Course[];
  outsideBa: Course[];
  outsideBs: Course[];

  filteredCore: Course[];
  filteredComp: Course[];
  filteredOutside: Course[];
  
  setCoursePlan(coursePlan: string): void {
    sessionStorage.setItem('coursePlan', coursePlan)
    this.coursePlan = coursePlan;
    this.setCourses();
  }

  setCourses(){
    this.filteredCore = this.filterCourses(this.coreCourses);
    this.filteredComp = this.filterCourses(this.compCourses);
    switch (this.coursePlan){
      case "ba":
        this.filteredOutside = this.filterCourses(this.outsideBa);
        break;
      case "bs":
        this.filteredOutside = this.filterCourses(this.outsideBs);
    }
  }

  filterCourses(courses: Course[]){
    let infrequentFiltered = courses.         filter(course => (!this.hideInfrequent || !course.semesters.includes('infreqent')))
    let upcomingFiltered = infrequentFiltered.filter(course => !(this.showOnlyUpcoming && !this.hasCurrentOffering(course)) )
    let gradFiltered = upcomingFiltered.      filter(course => this.showGradCourses || course.number < 700)

    return gradFiltered;
  }

  hasCurrentOffering(course: Course): boolean{
    let result = false;
    course.offerings.forEach(offering => {
      if(offering.semester == this.currentSemester && offering.year === this.currentYear ) { 
        result = true 
      }; 
    })

    return result;
  }

  toggleHideInfrequent(){
    this.hideInfrequent = !this.hideInfrequent;
    sessionStorage.setItem('hideInfrequent', JSON.stringify(this.hideInfrequent));
    this.setCourses();
  }

  toggleShowOnlyUpcoming(){
    this.showOnlyUpcoming = !this.showOnlyUpcoming;
    sessionStorage.setItem('showOnlyUpcoming', JSON.stringify(this.showOnlyUpcoming));
    if(this.showOnlyUpcoming && this.hideInfrequent) { this.toggleHideInfrequent() };
    this.setCourses();
  }

  toggleShowGradCourses(){
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

    if(sessionStorage.getItem('coreCourses')){
      this.coreCourses = JSON.parse(sessionStorage.getItem('coreCourses')) as Course[];
    } else {
      this.courseService.getCoursesInRange('COMP', 401, 411).then( courses => { 
        this.coreCourses = courses.sort(this.courseSort)
        sessionStorage.setItem('coreCourses', JSON.stringify(this.coreCourses));
      }).catch()
    }

    if(sessionStorage.getItem('compCourses')){
      this.compCourses = JSON.parse(sessionStorage.getItem('compCourses')) as Course[];
    } else {
      this.courseService.getCoursesInRange('COMP', 426, 999).then( courses => { 
        this.compCourses = courses.sort(this.courseSort)
        sessionStorage.setItem('compCourses', JSON.stringify(this.compCourses));
      }).catch()
    }

    if(sessionStorage.getItem('outsideBa')){
      this.outsideBa = JSON.parse(sessionStorage.getItem('outsideBa')) as Course[];
    } else {
      this.courseService.getCoursesInRange('COMP', 110, 116).then( courses => {
        this.outsideBa = courses.sort(this.courseSort);
        sessionStorage.setItem('outsideBa', JSON.stringify(this.outsideBa));
      }).catch()
    }

     if(sessionStorage.getItem('outsideBs')){
      this.outsideBs = JSON.parse(sessionStorage.getItem('outsideBs')) as Course[];
      this.setCoursePlan(this.coursePlan)
    } else {
      this.courseService.getCoursesInRange('COMP', 110, 116).then( courses => {
        this.outsideBs = courses.sort(this.courseSort);
        sessionStorage.setItem('outsideBs', JSON.stringify(this.outsideBs));
        this.setCoursePlan(this.coursePlan)
      }).catch()
    }
  }

  courseSort = function(course_a, course_b): number {
    if(course_a.dept < course_b.dept){
      return -1
    } else if(course_a.dept === course_b.dept){
      if(course_a.number < course_b.number){
        return -1
      } else if(course_a.number === course_b.number){
        return 0;
      } else {
        return 1
      }
    } else {
      return 1
    }
  }
}