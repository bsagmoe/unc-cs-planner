import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service'
import { AuthService } from '../services/auth.service'
import { Post } from '../post'
import { PostModel } from '../form-models/post.model'

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit {

  posts: Post[];

  filterTags: string;

  makingPost: boolean;

  model: PostModel = new PostModel('', '');

  constructor(private postService: PostService,
              private authService: AuthService) { }

  ngOnInit() {
    this.postService.getPosts().then(posts => this.posts = posts).catch();
    this.makingPost = false;
    this.filterTags = ''
  }

  toggleMakingPost(): void {
    this.makingPost = !this.makingPost;
  }

  submitPost() {
    let tags: string[];
    if (this.model.tags) {
      tags = this.model.tags.split(',').map(tag => tag.trim());
    } else {
      tags = [];
    }

    this.postService.createPost(this.model.text, tags)
      .then(res => {
        const post = res as Post;
        this.posts.unshift(post);
      }).catch();
    this.toggleMakingPost();
  }

  filterPosts() {
    if (this.filterTags) {
      this.postService.getPostsWithTags(this.filterTags.split(',').map(tag => tag.trim()))
        .then(posts => this.posts = posts).catch();
    } else {
      this.postService.getPosts().then(posts => this.posts = posts).catch();
    }
  }

}
