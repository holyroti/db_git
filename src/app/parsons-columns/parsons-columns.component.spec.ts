import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsonsColumnsComponent } from './parsons-columns.component';

describe('ParsonsColumnsComponent', () => {
  let component: ParsonsColumnsComponent;
  let fixture: ComponentFixture<ParsonsColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParsonsColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsonsColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
