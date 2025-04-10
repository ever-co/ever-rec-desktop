import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebcamFeatureComponent } from './webcam-feature.component';

describe('WebcamFeatureComponent', () => {
  let component: WebcamFeatureComponent;
  let fixture: ComponentFixture<WebcamFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebcamFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebcamFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
