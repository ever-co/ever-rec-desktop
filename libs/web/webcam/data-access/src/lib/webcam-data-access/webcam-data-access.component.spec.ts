import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebcamDataAccessComponent } from './webcam-data-access.component';

describe('WebcamDataAccessComponent', () => {
  let component: WebcamDataAccessComponent;
  let fixture: ComponentFixture<WebcamDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebcamDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebcamDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
