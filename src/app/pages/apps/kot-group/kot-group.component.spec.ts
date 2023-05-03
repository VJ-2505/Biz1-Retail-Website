import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KotGroupComponent } from './kot-group.component';

describe('KotGroupComponent', () => {
  let component: KotGroupComponent;
  let fixture: ComponentFixture<KotGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KotGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KotGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
