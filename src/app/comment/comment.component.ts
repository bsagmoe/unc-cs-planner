import { Component, OnInit, Input, Inject } from '@angular/core';

import { MatDialog } from '@angular/material'
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete.component'
import { VerifyEmailDialogComponent } from '../dialogs/verify-email.component'

import { AuthService } from '../services/auth.service'
import { UserService } from '../services/user.service'
import { CommentService } from '../services/comment.service'
import { Comment } from '../comment'
import { User } from '../user'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit {

  @Input()
  level: number;

  @Input()
  parentPath: string;

  @Input()
  comment: Comment;

  authUser: User;
  replyText: string;
  editText: string;

  likes: number;

  makingReply: boolean;
  editingReply: boolean;
  hideSelf: boolean;

  constructor(public verifyDialog: MatDialog,
              public dialog: MatDialog,
              public authService: AuthService,
              private userService: UserService,
              private commentService: CommentService) { }

  ngOnInit() {
    this.editingReply = this.makingReply = this.hideSelf = false;
    this.editText = this.comment.text;

    if (this.comment.likes) {
      this.likes = Object.keys(this.comment.likes).length;
    } else {
      this.likes = 0;
    }

    if (this.authService.authenticated) {
      this.authService.userObject.valueChanges().subscribe(authUser => this.authUser = authUser);
    }

    this.commentService
      .getCommentsFromDocument(`${this.comment.path}`).valueChanges()
      .subscribe(comments =>
        this.comment.comments = comments.sort( (a, b) => {
        return Object.keys(a.likes).length - Object.keys(b.likes).length
      }).reverse());
  }

  shouldShowInteractions(): boolean {
    return this.authService.uid === this.comment.uid && !this.makingReply && !this.editingReply;
  }

  getNumComments(comment: Comment): number {
    let sum = 1;

    if (comment.comments) {
      comment.comments.forEach(child => sum += this.getNumComments(child));
    }

    return sum;
  }

  toggleMakingReply() {
    if (this.authService.user.emailVerified === false) {
          const dialogRef = this.verifyDialog.open(VerifyEmailDialogComponent);

          dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
              this.authService.afAuth.auth.currentUser.sendEmailVerification().then(function() {
                console.log('verification email sent')
                return Promise.resolve();
              }).catch(function(error) {
                return Promise.reject({ message: 'Verification e-mail could not be sent. Try again later' });
              });
            }
          })
    } else {
      this.makingReply = true;
    }
  }

  toggleLike() {
    if (this.authService.user.emailVerified === false) {
          const dialogRef = this.verifyDialog.open(VerifyEmailDialogComponent);

          dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
              this.authService.afAuth.auth.currentUser.sendEmailVerification().then(function() {
                console.log('verification email sent')
                return Promise.resolve();
              }).catch(function(error) {
                return Promise.reject({ message: 'Verification e-mail could not be sent. Try again later' });
              });
            }
          })
    } else {
      if (this.authService.authenticated) {
        // There are either no likes yet or this user has not liked it yet
        if (!this.comment.likes || this.comment.likes[this.authService.uid] == null) {
          this.commentService.like(this.comment, this.authService.uid);
        } else {
          this.commentService.unlike(this.comment, this.authService.uid);
        }
      }
    }
  }

  submitComment() {
    this.makingReply = false;

    if (this.authService.authenticated && this.replyText && this.replyText.trim()) {
      this.commentService.createComment(this.replyText, this.comment.path, this.authService.uid, this.authUser.displayName)
        .then( _ => this.replyText = '')
        .catch(err => alert('You may need to log back in for e-mail verification to sync up'));
    }
  }

  saveEdit() {
    this.editingReply = false;

    if (this.authService.authenticated &&
        this.authService.uid === this.comment.uid &&
        this.editText && this.editText.trim() && this.editText !== this.comment.text) {
      this.commentService.editComment(this.editText, this.comment.path);
    }
  }

  redactComment() {
    this.commentService.redactComment(this.comment.path);
  }

  deleteComment() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.commentService.deleteComment(this.comment.path);
      }
    })
  }
}
