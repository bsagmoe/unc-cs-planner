import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Course } from '../course'

@Injectable()
export class CourseService {

    constructor(private http: Http) {}

    private coursesUrl = 'http://localhost:3000/api/courses';
    private headers = new Headers({'Content-Type': 'application/json'});

    getCourse(dept: string, number: number): Promise<Course>{
        const url = `${this.coursesUrl}/${dept.toUpperCase()}/${number}`
        return this.http.get(url)
                .toPromise().then(response => response.json() as Course)
                .catch(this.handleError);
    }

    getCourseWithModifier(dept: string, number: number, modifier: string): Promise<Course>{
        const url = `${this.coursesUrl}/${dept.toUpperCase()}/${number}/${modifier}`
        return this.http.get(url)
                .toPromise().then(response => response.json() as Course)
                .catch(this.handleError);
    }

    getCourses(dept: string): Promise<Course[]>{
        return this.http.get(`${this.coursesUrl}/${dept}`)
                .toPromise().then(response => response.json() as Course[])
                .catch(this.handleError);
    }

    getCoursesInRange(dept: string, min: number, max: number): Promise<Course[]> {

        let args = JSON.stringify({
            min: min,
            max: max
        });

        return this.http.get(`${this.coursesUrl}/${dept}`, {params: { min: min, max: max } })
                .toPromise().then(response => response.json() as Course[])
                .catch(this.handleError)
    }
    
    handleError(error: any): Promise<any> {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

}