import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumngametutorialComponent } from './columngametutorial.component';

describe('ColumngametutorialComponent', () => {
  let component: ColumngametutorialComponent;
  let fixture: ComponentFixture<ColumngametutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumngametutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumngametutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
