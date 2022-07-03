import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as allFactions from '../../../../assets/test-data/faction/All.json';
import { Faction, SpringDataRestResponse } from '../../types';
import { ApiConfigProvider, API_CONFIG_TOKEN } from './base';
import { FactionService } from './faction.service';

const testApiUrl = 'http://fake-url.coms';

describe('FactionService', () => {
  let factionService: FactionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_CONFIG_TOKEN, useValue: { apiUrl: testApiUrl } as ApiConfigProvider }],
    });

    factionService = TestBed.inject(FactionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should getCollection', () => {
    const testData: SpringDataRestResponse<Faction> = allFactions;
    factionService.getCollection().subscribe((data) => expect(data).toEqual(testData));
    const req = httpTestingController.expectOne('http://fake-url.coms/faction?page=0&size=20');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);

    httpTestingController.verify();
  });
});
