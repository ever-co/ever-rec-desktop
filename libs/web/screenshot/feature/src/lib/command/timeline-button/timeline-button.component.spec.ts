import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineButtonComponent } from './timeline-button.component';

describe('TimelineButtonComponent', () => {
  let component: TimelineButtonComponent;
  let fixture: ComponentFixture<TimelineButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
