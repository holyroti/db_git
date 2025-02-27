import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsonsRelationsComponent } from './parsons-relations.component';

describe('ParsonsRelationsComponent', () => {
  let component: ParsonsRelationsComponent;
  let fixture: ComponentFixture<ParsonsRelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParsonsRelationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsonsRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
