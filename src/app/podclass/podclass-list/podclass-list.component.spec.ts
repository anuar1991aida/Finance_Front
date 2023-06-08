import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodclassListComponent } from './podclass-list.component';

describe('PodclassListComponent', () => {
  let component: PodclassListComponent;
  let fixture: ComponentFixture<PodclassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodclassListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodclassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
