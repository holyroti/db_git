import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsonsEasyComponent } from './parsons-easy.component';

describe('ParsonsEasyComponent', () => {
  let component: ParsonsEasyComponent;
  let fixture: ComponentFixture<ParsonsEasyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParsonsEasyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsonsEasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
