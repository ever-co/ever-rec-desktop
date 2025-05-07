import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBadgeComponent } from './upload-badge.component';

describe('UploadBadgeComponent', () => {
  let component: UploadBadgeComponent;
  let fixture: ComponentFixture<UploadBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
