import { Injectable } from '@angular/core';

import { AngularFirestore,  AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore'

import { Course } from '../course'
import { User } from '../user'
import { UserCourse } from '../user-course'
import { Post } from '../post'
import { PlannerStatus } from '../user-course'

@Injectable()
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getUser(uid: string): AngularFirestoreDocument<User> {
    return this.afs.doc<User>(`/users/${uid}`);
  }

  createUser(uid: string, body: any): Promise<void> {
    return this.afs.doc<User>(`/users/${uid}`).set(body);
  }

  updateUser(uid: string, body: any): Promise<void> {
    return this.afs.doc<User>(`/users/${uid}`).update(body);
  }

  getUserCourses(uid: string): AngularFirestoreCollection<UserCourse> {
    return this.afs.collection<UserCourse>(`/users/${uid}/courses/`);
  }

  removeUserCourse(uid: string, course: Course): Promise<void> {
    return this.afs.collection<UserCourse>(`/users/${uid}/courses`).doc(course.dept + course.number + course.modifier).delete();
  }

  updateUserCourses(uid: string, course: Course, plannerStatus: PlannerStatus, key: string) {
    const courseCollection = this.afs.collection<UserCourse>(`/users/${uid}/courses`);
    courseCollection.doc(course.dept + course.number + course.modifier).set( {course, plannerStatus} );
  }
}
