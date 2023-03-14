import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticTransferComponent } from './domestic-transfer.component';

describe('DomesticTransferComponent', () => {
  let component: DomesticTransferComponent;
  let fixture: ComponentFixture<DomesticTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomesticTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomesticTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
