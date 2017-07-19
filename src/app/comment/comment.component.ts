import { Component, OnInit, Input } from '@angular/core';
import { UserContextService } from '../services/user-context.service'
import { CommentService } from '../services/comment.service'
import { Comment } from '../comment'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit {

  @Input()
  comment: Comment;

  @Input()
  level: number;

  userString: string;
  makingReply: boolean;
  hideSelf: boolean;

  text: string;

  constructor(private userContextService: UserContextService,
              private commentService: CommentService) { }

  ngOnInit() {
    if(this.comment.comments != null){
      this.comment.comments as Comment[];
    }

    this.userString = this.getUserString();
    this.makingReply = false;
    this.hideSelf = false;
  }

  getUserString(): string {
      if(!this.comment.user){
        return;
      } else if(this.comment.user.name['first'] && this.comment.user.name['last']){
        return this.comment.user.name['first'] + " " + this.comment.user.name['last'];
      } else {
        return this.comment.user.username;
      }
  }

  getNumComments(comment: Comment): number {
    let sum: number = 1;
    comment.comments.forEach(child => sum += this.getNumComments(child));
    return sum;
  }

  submitComment(){
    let comment;
    // Only submit the comment if it actually has any meaningful text in it
    if(this.text && this.text.trim()){
      this.commentService.createComment(this.text, this.comment._id).then(
        res => {
          this.text = '';
          comment = res as Comment;
          this.makingReply = false;
          this.comment.comments.push(comment);
          this.commentService.addCommentToComment(this.comment._id, comment._id)
                .then().catch(err => {console.log(err)});
        }
      ).catch(err => {console.log(err)});
    }
  }
}
