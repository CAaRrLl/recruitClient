import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcRootComponent } from './alc-root.component';

describe('AlcRootComponent', () => {
  let component: AlcRootComponent;
  let fixture: ComponentFixture<AlcRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlcRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
