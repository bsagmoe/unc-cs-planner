import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { Post } from '../post'

@Component({
  selector: 'app-post-pager',
  templateUrl: './post-pager.component.html',
  styleUrls: ['./post-pager.component.css']
})

export class PostPagerComponent implements OnInit {

  @Input()
  posts: Post[];
  index: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.index = JSON.parse(sessionStorage.getItem(this.route.toString())) || 0;
  }

  changeIndex(index: number): void {
    sessionStorage.setItem(this.route.toString(), JSON.stringify(index));
    this.index = index;
  }

}
