import { TestBed } from '@angular/core/testing';

import { PageResetPasswordService } from './page-reset-password.service';

describe('PageResetPasswordService', () => {
  let service: PageResetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageResetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
