import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDialogValidationComponent } from './password-dialog-validation.component';

describe('PasswordDialogValidationComponent', () => {
  let component: PasswordDialogValidationComponent;
  let fixture: ComponentFixture<PasswordDialogValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordDialogValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordDialogValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
