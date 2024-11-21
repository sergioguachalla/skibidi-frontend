import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFineComponent } from './type-fine.component';

describe('TypeFineComponent', () => {
  let component: TypeFineComponent;
  let fixture: ComponentFixture<TypeFineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeFineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeFineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
