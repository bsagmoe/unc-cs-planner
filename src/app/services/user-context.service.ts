import { Injectable } from '@angular/core';

import { User } from '../user'
import { Course } from '../course'

@Injectable()
export class UserContextService {

  constructor() { }

  getCurrentUser(): User{
    return JSON.parse(localStorage.getItem('user')) as User;
  }

  setCurrentUser(user){
    localStorage.setItem('user', JSON.stringify(user));
  }

  logoutUser(){
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  // updateUserCourses(course: Course, status: string){
  //   let user = this.getCurrentUser()
  //   let userCourses = user.courses;
  //   let found = false;

  //   userCourses.forEach(courseWrapper => {
  //     if(courseWrapper.course._id === course._id){
  //       courseWrapper.status = status;
  //       found = true;
  //     }
  //   })

  //   if(!found){
  //     userCourses.push({course: course, status: status});
  //   }

  //   this.setCurrentUser(user);

  // }

}
