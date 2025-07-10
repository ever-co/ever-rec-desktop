import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFeatureComponent } from './user-feature.component';

describe('UserFeatureComponent', () => {
  let component: UserFeatureComponent;
  let fixture: ComponentFixture<UserFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
