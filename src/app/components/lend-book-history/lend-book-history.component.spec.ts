import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendBookHistoryComponent } from './lend-book-history.component';

describe('LendBookHistoryComponent', () => {
  let component: LendBookHistoryComponent;
  let fixture: ComponentFixture<LendBookHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendBookHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LendBookHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
