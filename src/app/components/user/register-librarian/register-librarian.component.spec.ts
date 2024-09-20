import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLibrarianComponent } from './register-librarian.component';

describe('RegisterLibrarianComponent', () => {
  let component: RegisterLibrarianComponent;
  let fixture: ComponentFixture<RegisterLibrarianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLibrarianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLibrarianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
