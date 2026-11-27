import { TestBed } from '@angular/core/testing';

import { UpdateProjectService } from './update-project.service';

describe('UpdateProjectService', () => {
  let service: UpdateProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
