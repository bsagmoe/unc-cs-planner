import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Comment } from '../comment'

import { UserContextService } from './user-context.service'


@Injectable()
export class CommentService {

  constructor(private http: Http,
              private userContextService: UserContextService) { }

  commentUrl: string = 'http://localhost:3000/api/comments';
  headers: Headers = new Headers( {'Content-Type': 'application/json'} );

  createComment(text: string, parent: string, ): Promise<Comment> {

    let postBody = JSON.stringify({
      text: text,
      parent: parent,
      user: this.userContextService.getCurrentUser()
    })

    return this.http.post(this.commentUrl, postBody, { headers: this.headers })
      .toPromise().then(response => response.json() as Comment).catch();
  }

    addCommentToComment(commentId: string, replyId: string){
      let patchBody = JSON.stringify({
        replyId: replyId,
        user: this.userContextService.getCurrentUser()
      })

      return this.http.patch(`${this.commentUrl}/${commentId}`, patchBody, { headers: this.headers })
              .toPromise().then(response => response.json() as Comment)
              .catch();
  }

}
