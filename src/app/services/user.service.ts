import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'

import { UserContextService } from '../services/user-context.service'

import { User } from '../user'
import { Post } from '../post'
import { PlannerStatus } from '../course-detail/course-detail.component'

@Injectable()
export class UserService {

  constructor(private http: Http,
              private userContextService: UserContextService ) { }

  private userUrl = 'http://localhost:3000/api/users'
  private headers = new Headers({'Content-Type': 'application/json'});


  getUser(username: String): Promise<User>{
    return this.http.get(`${this.userUrl}/${username}`)
            .toPromise().then(user => user.json() as User)
            .catch(err => console.error(err))
  }

  getUserPosts(userId: String): Promise<Post[]>{
    return this.http.get(`${this.userUrl}/${userId}/posts`)
            .toPromise().then(posts => posts.json() as Post[])
            .catch(err => console.error(err))
  }

  updateUserCourses(courseId: string, status: PlannerStatus){
    let currentUser = this.userContextService.getCurrentUser(); 
    
    let patchBody = JSON.stringify({
      user: currentUser,
      status: status
    })

    return this.http.patch(`${this.userUrl}/${currentUser._id}/courses/${courseId}`, patchBody, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as User)
            .catch(err => console.error(err))
  }

}
