import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsDialogComponent } from './achievements-dialog.component';

describe('AchievementsDialogComponent', () => {
  let component: AchievementsDialogComponent;
  let fixture: ComponentFixture<AchievementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
