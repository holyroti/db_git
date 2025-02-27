import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicSelectDialogComponent } from './profile-pic-select-dialog.component';

describe('ProfilePicSelectDialogComponent', () => {
  let component: ProfilePicSelectDialogComponent;
  let fixture: ComponentFixture<ProfilePicSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePicSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePicSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
