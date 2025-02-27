import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialDragComponent } from './tutorial-drag.component';

describe('TutorialDragComponent', () => {
  let component: TutorialDragComponent;
  let fixture: ComponentFixture<TutorialDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialDragComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
