  import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentClientComponent } from './environment-client.component';

describe('EnvironmentClientComponent', () => {
  let component: EnvironmentClientComponent;
  let fixture: ComponentFixture<EnvironmentClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
