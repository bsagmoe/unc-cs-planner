import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { UserContextService } from './user-context.service'

import { Post } from '../post'


@Injectable()
export class PostService {

  private baseUrl = "http://localhost:3000/api";
  private postsUrl = `${ this.baseUrl }/posts`;

  headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private userContextService: UserContextService) { }

  createPost(text: string, tags: string[]): Promise<Post>{

    let postBody = JSON.stringify({
        text: text,
        tags: tags,
        user: this.userContextService.getCurrentUser()
      })

    return this.http.post(this.postsUrl, postBody, { headers: this.headers } )
      .toPromise().then(response => response.json() as Post).catch(this.handleError);
  }


  addCommentToPost(postId: string, commentId: string){

    let patchBody = JSON.stringify({
      commentId: commentId,
      user: this.userContextService.getCurrentUser()
    })

    return this.http.patch(`${this.postsUrl}/${postId}`, patchBody, { headers: this.headers })
            .toPromise().then(response => response.json() as Post)
            .catch(this.handleError);
  }

  getPost(postId: string): Promise<Post>{
    console.log("Getting post:", postId)
    return this.http.get(`${this.postsUrl}/${postId}`)
            .toPromise().then(response => response.json() as Post)
            .catch(this.handleError);
  }

  getPosts(): Promise<Post[]>{
    return this.http.get(this.postsUrl)
            .toPromise().then(response => response.json() as Post[])
            .catch(this.handleError);
  }

  getPostsWithTags(tags: string[]): Promise<Post[]>{
    return this.http.get(`${this.postsUrl}/${JSON.stringify(tags)}`)
            .toPromise().then(response => response.json() as Post[])
            .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
