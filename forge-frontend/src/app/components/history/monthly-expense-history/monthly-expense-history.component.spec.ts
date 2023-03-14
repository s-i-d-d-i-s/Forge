import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseHistoryComponent } from './monthly-expense-history.component';

describe('MonthlyExpenseHistoryComponent', () => {
  let component: MonthlyExpenseHistoryComponent;
  let fixture: ComponentFixture<MonthlyExpenseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyExpenseHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
