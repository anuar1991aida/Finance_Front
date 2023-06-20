import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkrDetailComponent } from './fkr-detail.component';

describe('FkrDetailComponent', () => {
  let component: FkrDetailComponent;
  let fixture: ComponentFixture<FkrDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FkrDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FkrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
