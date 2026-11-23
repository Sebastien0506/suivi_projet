import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteObjectifComponent } from './delete-objectif.component';

describe('DeleteObjectifComponent', () => {
  let component: DeleteObjectifComponent;
  let fixture: ComponentFixture<DeleteObjectifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteObjectifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteObjectifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
