import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbleComponent } from './add-able.component';

describe('AddAbleComponent', () => {
  let component: AddAbleComponent;
  let fixture: ComponentFixture<AddAbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
