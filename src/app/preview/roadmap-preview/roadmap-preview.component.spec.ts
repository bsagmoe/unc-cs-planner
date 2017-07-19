import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapPreviewComponent } from './roadmap-preview.component';

describe('RoadmapPreviewComponent', () => {
  let component: RoadmapPreviewComponent;
  let fixture: ComponentFixture<RoadmapPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadmapPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadmapPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
