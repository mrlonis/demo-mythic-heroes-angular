import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MythicHero } from '../../types';
import { ApiConfigProvider, ApiService, API_CONFIG_TOKEN } from './base';

@Injectable({
  providedIn: 'root',
})
export class HeroService extends ApiService<MythicHero> {
  constructor(public http: HttpClient, @Inject(API_CONFIG_TOKEN) apiConfig: ApiConfigProvider) {
    super(http, 'mythicHero', apiConfig);
  }
}
