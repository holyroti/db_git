import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorSpeechComponent } from './professor-speech.component';

describe('ProfessorSpeechComponent', () => {
  let component: ProfessorSpeechComponent;
  let fixture: ComponentFixture<ProfessorSpeechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorSpeechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
