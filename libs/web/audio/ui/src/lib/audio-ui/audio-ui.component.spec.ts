import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioUiComponent } from './audio-ui.component';

describe('AudioUiComponent', () => {
  let component: AudioUiComponent;
  let fixture: ComponentFixture<AudioUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
