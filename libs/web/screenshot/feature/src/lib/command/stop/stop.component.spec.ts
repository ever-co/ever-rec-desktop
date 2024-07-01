import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StopComponent } from './stop.component';

describe('StopComponent', () => {
  let component: StopComponent;
  let fixture: ComponentFixture<StopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
