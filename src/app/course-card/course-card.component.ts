import { Input, Component, OnInit } from '@angular/core';
import { Course } from '../course'

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})

export class CourseCardComponent implements OnInit {

  @Input()
  course: Course;

  semesterString: string;

  upperCaseFirst(str: string):string {
    // I made a type when creating the database
    if(str == 'infreqent') str = 'infrequent'
    return str.charAt(0).toUpperCase() + str.substr(1);
  }
  
  setSemesterString(): void {
    switch(this.course.semesters.length){
      case 0:
        this.semesterString = 'Unknown'
        break;
      case 1:
        this.semesterString = this.upperCaseFirst(this.course.semesters[0]);
        break;
      case 2:
        this.semesterString = this.upperCaseFirst(this.course.semesters[0]) + ', ' + this.upperCaseFirst(this.course.semesters[1])
        break;
      case 3:
        this.semesterString = this.upperCaseFirst(this.course.semesters[0]) + ', ' + this.upperCaseFirst(this.course.semesters[1]) + ', ' + this.upperCaseFirst(this.course.semesters[2])
        break;
    }
  }

  constructor() { }

  ngOnInit() {
    this.setSemesterString();
  }

}
