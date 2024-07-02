import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenshotComponent } from './screenshot.component';

describe('ScreenshotComponent', () => {
  let component: ScreenshotComponent;
  let fixture: ComponentFixture<ScreenshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenshotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
