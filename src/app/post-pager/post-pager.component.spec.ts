import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPagerComponent } from './post-pager.component';

describe('PostPagerComponent', () => {
  let component: PostPagerComponent;
  let fixture: ComponentFixture<PostPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
