import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserUiComponent } from './user-ui.component';

describe('UserUiComponent', () => {
  let component: UserUiComponent;
  let fixture: ComponentFixture<UserUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
