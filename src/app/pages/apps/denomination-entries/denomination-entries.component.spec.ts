import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationEntriesComponent } from './denomination-entries.component';

describe('DenominationEntriesComponent', () => {
  let component: DenominationEntriesComponent;
  let fixture: ComponentFixture<DenominationEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DenominationEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
