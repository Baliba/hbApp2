import { TestBed } from '@angular/core/testing';

import { AdMobService } from './ad-mob.service';

describe('AdMobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdMobService = TestBed.get(AdMobService);
    expect(service).toBeTruthy();
  });
});
