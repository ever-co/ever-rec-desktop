import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetHeatMapComponent } from './timesheet-heat-map.component';

describe('TimesheetHeatMapComponent', () => {
  let component: TimesheetHeatMapComponent;
  let fixture: ComponentFixture<TimesheetHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetHeatMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
