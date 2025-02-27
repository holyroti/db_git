import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsonsProblemComponent } from './parsons-problem.component';

describe('ParsonsProblemComponent', () => {
  let component: ParsonsProblemComponent;
  let fixture: ComponentFixture<ParsonsProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParsonsProblemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsonsProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
