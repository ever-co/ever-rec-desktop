import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectSizeMatrixComponent } from './effect-size-matrix.component';

describe('EffectSizeMatrixComponent', () => {
  let component: EffectSizeMatrixComponent;
  let fixture: ComponentFixture<EffectSizeMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffectSizeMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectSizeMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
