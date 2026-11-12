import { TestBed } from '@angular/core/testing';

import { MyProjectService } from './my-project.service';

describe('MyProjectService', () => {
  let service: MyProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
