import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsstestComponent } from './csstest.component';

describe('CsstestComponent', () => {
  let component: CsstestComponent;
  let fixture: ComponentFixture<CsstestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsstestComponent]
    });
    fixture = TestBed.createComponent(CsstestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
