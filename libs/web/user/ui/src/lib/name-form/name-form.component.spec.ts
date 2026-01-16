import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
