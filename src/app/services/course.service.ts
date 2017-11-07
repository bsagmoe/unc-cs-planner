import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore'

import 'rxjs/add/operator/toPromise';

import { Course } from '../course'


@Injectable()
export class CourseService {

    constructor( private afs: AngularFirestore ) {
        // const coursesString =
        // ``;
        // const courses: Course[] = JSON.parse(coursesString) as Course[] ;
        // courses.forEach(course => {
        //     console.log(course);
        //     afs.doc(`/courses/${course.dept}/catalog/${course.number + course.modifier}`).set(course)
        // })
    }

    getCourse(dept: string, number: number): AngularFirestoreDocument<Course> {
        return this.afs.doc(`/courses/${dept}/catalog/${number}`)
    }

    getCourseWithModifier(dept: string, number: number, modifier: string): AngularFirestoreDocument<Course> {
        return this.afs.doc(`/courses/${dept}/catalog/${number + modifier}`)
    }

    getCourses(dept: string): AngularFirestoreCollection<Course> {
        return this.afs.collection(`/courses/${dept}/catalog`)
    }

    getCourseBatch(courses: string[]): Promise<Course[]>  {
        return Promise.all(
            courses
                .map(course => {
                        const parts = course.split(' ');
                        return this.getCourse(parts[0], +parts[1])
                    })
                .map(document => document.valueChanges().take(1).toPromise())
        )
    }

    getCoursesInRange(dept: string, min: number, max: number): AngularFirestoreCollection<Course> {
        return this.afs.collection(`/courses/${dept}/catalog`,
            ref => ref.where('number', '>=', min).where('number', '<=', max))
    }
}

