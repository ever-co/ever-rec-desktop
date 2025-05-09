import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQueueComponent } from './upload-queue.component';

describe('UploadQueueComponent', () => {
  let component: UploadQueueComponent;
  let fixture: ComponentFixture<UploadQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
