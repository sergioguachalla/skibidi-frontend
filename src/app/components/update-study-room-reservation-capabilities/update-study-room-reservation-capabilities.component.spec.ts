import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudyRoomReservationCapabilitiesComponent } from './update-study-room-reservation-capabilities.component';

describe('UpdateStudyRoomReservationCapabilitiesComponent', () => {
  let component: UpdateStudyRoomReservationCapabilitiesComponent;
  let fixture: ComponentFixture<UpdateStudyRoomReservationCapabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStudyRoomReservationCapabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStudyRoomReservationCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
