import { Component, OnInit, Input } from '@angular/core';

import { User } from '../user'
import { Post } from '../post'
import { Comment } from '../comment'

import { UserService } from '../services/user.service'
import { CommentService } from '../services/comment.service'
import { PostService } from '../services/post.service'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ CommentService ]
})

export class PostComponent implements OnInit {

  private _post: Post;

  // When used in the post-pager component, we need to recalculate which comments exist, etc. when the post changes
  @Input() set post(post: Post){
    this._post = post;
    this.initPost();
  }

  get post(): Post {
    return this._post;
  }

  replyText: string;
  editText: string;
  editTags: string;

  editingPost: boolean;

  verificationStatus: string;

  constructor(private commentService: CommentService,
              private postService: PostService,
              private userService: UserService,
              public authService: AuthService) { }

  ngOnInit() {
    this.initPost();
  }

  initPost() {
    this.editingPost = false;
    this.editText = this.post.text;
    this.editTags = this.post.tags ? this.post.tags.join(', ') : '';

    // Load and display all of the subcomments
    this.commentService.getPostComments(this.post.id).valueChanges().subscribe(comments => {
      this.post.comments = comments.sort( (a, b) => {
        return Object.keys(a.likes).length - Object.keys(b.likes).length
      }).reverse();
    })
  }

  submitComment() {
    if (this.authService.authenticated && this.replyText && this.replyText.trim()) {
      this.commentService.createComment(this.replyText, `/posts/${this.post.id}`, this.authService.uid, this.authService.user.displayName)
        .then( _ => this.replyText = '')
        .catch(err => alert('You may need to log back in for e-mail verification to sync up'));
    }
  }

  saveEdit() {
    this.editingPost = false;

    // make sure that only the user who created it can edit it
    // also, that the post has changed in some way
    if (this.authService.authenticated &&
        this.authService.uid === this.post.uid &&
        ((this.editText && this.editText.trim() && this.editText !== this.post.text) ||
         (this.editTags !== this.post.tags.join(', ') )) ) {
      this.postService.editPost(this.editText, this.editTags, this.post.id);
    }
  }

  sendVerificationEmail() {
    this.authService.user.sendEmailVerification()
      .then(result => this.verificationStatus = 'Sent.')
      .catch(result => this.verificationStatus = 'Could not send.')
  }
}
