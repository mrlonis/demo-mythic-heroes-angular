import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Faction } from '../../types';
import { ApiConfigProvider, ApiService, API_CONFIG_TOKEN } from './base';

@Injectable({
  providedIn: 'root',
})
export class FactionService extends ApiService<Faction> {
  constructor(public http: HttpClient, @Inject(API_CONFIG_TOKEN) apiConfig: ApiConfigProvider) {
    super(http, 'faction', apiConfig);
  }
}
