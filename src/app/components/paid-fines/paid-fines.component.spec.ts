import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidFinesComponent } from './paid-fines.component';

describe('PaidFinesComponent', () => {
  let component: PaidFinesComponent;
  let fixture: ComponentFixture<PaidFinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidFinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidFinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
