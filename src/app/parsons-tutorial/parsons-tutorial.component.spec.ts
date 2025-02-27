import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsonsTutorialComponent } from './parsons-tutorial.component';

describe('ParsonsTutorialComponent', () => {
  let component: ParsonsTutorialComponent;
  let fixture: ComponentFixture<ParsonsTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParsonsTutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsonsTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
