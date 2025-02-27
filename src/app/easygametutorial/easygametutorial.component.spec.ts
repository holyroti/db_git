import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyGameTutorialComponent } from './easygametutorial.component';

describe('GameComponent', () => {
  let component: EasyGameTutorialComponent;
  let fixture: ComponentFixture<EasyGameTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyGameTutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyGameTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
