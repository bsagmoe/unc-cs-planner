import { Component, OnInit, Input } from '@angular/core';

import { User } from '../user'
import { Post } from '../post'
import { Comment } from '../comment'

import { PostService } from '../services/post.service'
import { CommentService } from '../services/comment.service'
import { UserContextService } from '../services/user-context.service'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ CommentService ]
})

export class PostComponent implements OnInit {

  @Input()
  post: Post;

  user: User;
  userString: string;
  text: string;

  constructor(private commentService: CommentService,
              private postService: PostService,
              private userContextService: UserContextService ) { }

  ngOnInit() {
    this.user = this.userContextService.getCurrentUser()
  }

  getUserString(): string {
     if (!this.post.user) {
        return;
     } else if (this.post.user.name['first'] && this.post.user.name['last']){
        return this.post.user.name['first'] + " " + this.post.user.name['last'];
    } else {
        return this.post.user.username;
    }
  }

  submitComment(){
    let comment;
    if(this.text && this.text.trim()){
      this.commentService.createComment(this.text, this.post._id).then(
        res => {
          this.text = '';
          comment = res as Comment;
          this.post.comments.push(comment);
          this.postService.addCommentToPost(this.post._id, comment._id)
                .then().catch(err => {console.log(err)});
        }
      ).catch(err => {console.log(err)});
    }
  }

}
