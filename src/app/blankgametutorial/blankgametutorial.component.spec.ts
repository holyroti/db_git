import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankgametutorialComponent } from './blankgametutorial.component';

describe('BlankgametutorialComponent', () => {
  let component: BlankgametutorialComponent;
  let fixture: ComponentFixture<BlankgametutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlankgametutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlankgametutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
