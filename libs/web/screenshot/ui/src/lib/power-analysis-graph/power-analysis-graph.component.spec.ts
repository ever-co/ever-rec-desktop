import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerAnalysisGraphComponent } from './power-analysis-graph.component';

describe('PowerAnalysisGraphComponent', () => {
  let component: PowerAnalysisGraphComponent;
  let fixture: ComponentFixture<PowerAnalysisGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerAnalysisGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerAnalysisGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
