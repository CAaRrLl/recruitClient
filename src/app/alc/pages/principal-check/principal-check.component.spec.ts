import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalCheckComponent } from './principal-check.component';

describe('PrincipalCheckComponent', () => {
  let component: PrincipalCheckComponent;
  let fixture: ComponentFixture<PrincipalCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
