import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetHeatMapWidgetComponent } from './timesheet-heat-map-widget.component';

describe('TimesheetHeatMapWidgetComponent', () => {
  let component: TimesheetHeatMapWidgetComponent;
  let fixture: ComponentFixture<TimesheetHeatMapWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetHeatMapWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetHeatMapWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
