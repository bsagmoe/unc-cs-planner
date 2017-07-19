import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPreviewComponent } from './info-preview.component';

describe('InfoPreviewComponent', () => {
  let component: InfoPreviewComponent;
  let fixture: ComponentFixture<InfoPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
