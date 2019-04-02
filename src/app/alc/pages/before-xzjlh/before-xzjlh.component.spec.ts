import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeXzjlhComponent } from './before-xzjlh.component';

describe('BeforeXzjlhComponent', () => {
  let component: BeforeXzjlhComponent;
  let fixture: ComponentFixture<BeforeXzjlhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeforeXzjlhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeXzjlhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
