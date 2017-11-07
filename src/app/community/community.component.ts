import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

import { MatDialog } from '@angular/material';
import { VerifyEmailDialogComponent } from '../dialogs/verify-email.component'

import { Post } from '../post';
import { User } from '../user';
import { PostModel } from '../form-models/post.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit {

  posts: Post[];
  filterTag: string;
  makingPost: boolean;
  model: PostModel = new PostModel('', '');

  constructor(public verifyDialog: MatDialog,
              private postService: PostService,
              public authService: AuthService) { }

  ngOnInit() {
    this.postService.getPosts().valueChanges().subscribe(posts => {
      this.posts = posts;
    });
    this.makingPost = false;
    this.filterTag = ''
  }

  toggleMakingPost(): void {
    if (this.authService.user.emailVerified === false) {
          const dialogRef = this.verifyDialog.open(VerifyEmailDialogComponent);

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
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
      this.makingPost = !this.makingPost;
    }
  }

  submitPost() {
    const numPosts = this.posts.length;
    this.postService.createPost(this.model.text, this.model.tags, this.authService.uid, this.authService.user.displayName)
      .then( _ => {
        this.model.text = '';
        this.model.tags = '';
      })
      .catch(err => alert('You may need to log back in for e-mail verification to sync up'));
    this.toggleMakingPost();
  }

  filterPosts() {
    if (this.filterTag) {
      this.postService.getPostsWithTag(this.filterTag).valueChanges().subscribe(posts => {
        this.posts = posts;
      })
    } else {
      this.postService.getPosts().valueChanges().subscribe(posts => {
        this.posts = posts;
      });
    }
  }

}
