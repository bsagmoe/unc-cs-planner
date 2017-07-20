import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Comment } from '../comment'

@Injectable()
export class CommentService {
  // TODO: this will need to be redone to reflect how Firebase works

  commentUrl = 'http://localhost:3000/api/comments';
  headers: Headers = new Headers( {'Content-Type': 'application/json'} );

  constructor(private http: Http) { }

  createComment(text: string, parent: string, ): Promise<Comment> {

    const postBody = JSON.stringify({
      text: text,
      parent: parent,
    })

    return this.http.post(this.commentUrl, postBody, { headers: this.headers })
      .toPromise().then(response => response.json() as Comment).catch();
  }

    addCommentToComment(commentId: string, replyId: string) {
      const patchBody = JSON.stringify({
        replyId: replyId,
      })

      return this.http.patch(`${this.commentUrl}/${commentId}`, patchBody, { headers: this.headers })
              .toPromise().then(response => response.json() as Comment)
              .catch();
  }

}
