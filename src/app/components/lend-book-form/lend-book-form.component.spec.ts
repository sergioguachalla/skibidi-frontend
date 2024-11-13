import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendBookFormComponent } from './lend-book-form.component';

describe('LendBookFormComponent', () => {
  let component: LendBookFormComponent;
  let fixture: ComponentFixture<LendBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendBookFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LendBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
