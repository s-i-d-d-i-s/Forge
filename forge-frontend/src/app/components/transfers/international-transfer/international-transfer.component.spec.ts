import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalTransferComponent } from './international-transfer.component';

describe('InternationalTransferComponent', () => {
  let component: InternationalTransferComponent;
  let fixture: ComponentFixture<InternationalTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
