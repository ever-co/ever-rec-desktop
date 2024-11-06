import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFeatureComponent } from './upload-feature.component';

describe('UploadFeatureComponent', () => {
  let component: UploadFeatureComponent;
  let fixture: ComponentFixture<UploadFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
