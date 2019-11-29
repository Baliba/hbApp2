import { TestBed } from '@angular/core/testing';

import { GetAudioService } from './get-audio.service';

describe('GetAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAudioService = TestBed.get(GetAudioService);
    expect(service).toBeTruthy();
  });
});
