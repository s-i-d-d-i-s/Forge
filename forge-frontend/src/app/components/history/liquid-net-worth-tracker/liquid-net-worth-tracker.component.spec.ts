import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidNetWorthTrackerComponent } from './liquid-net-worth-tracker.component';

describe('LiquidNetWorthTrackerComponent', () => {
  let component: LiquidNetWorthTrackerComponent;
  let fixture: ComponentFixture<LiquidNetWorthTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidNetWorthTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidNetWorthTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
