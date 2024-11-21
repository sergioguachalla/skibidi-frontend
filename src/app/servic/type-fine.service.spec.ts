import { TestBed } from '@angular/core/testing';

import { TypeFineService } from './type-fine.service';

describe('TypeFineService', () => {
  let service: TypeFineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeFineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
