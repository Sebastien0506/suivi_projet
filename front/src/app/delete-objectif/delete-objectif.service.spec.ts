import { TestBed } from '@angular/core/testing';

import { DeleteObjectifService } from './delete-objectif.service';

describe('DeleteObjectifService', () => {
  let service: DeleteObjectifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteObjectifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
