import type { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { ApiConfigProvider } from './base';
import { ApiService, API_CONFIG_TOKEN } from './base';
import type { Type } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class TypeService extends ApiService<Type> {
  constructor(public http: HttpClient, @Inject(API_CONFIG_TOKEN) apiConfig: ApiConfigProvider) {
    super(http, 'type', apiConfig);
  }
}
