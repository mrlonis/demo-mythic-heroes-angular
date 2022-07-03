import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, InjectionToken } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseResource, SpringDataRestResponse } from '../../../types';

export interface ApiConfigProvider {
  apiUrl?: string;
}

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfigProvider>('api.config');

export interface IApiService<T extends BaseResource> {
  get apiUrl(): string;
  get baseUrl(): string;
  getCollection(params: HttpParams, page?: number, pageSize?: number): Observable<SpringDataRestResponse<T>>;
  getSingle(httpParams: HttpParams): Observable<T>;
  getImageUrl(imageUrlSuffix: string): string;
  log(message: string): void;
}

export abstract class ApiService<T extends BaseResource> implements IApiService<T> {
  defaultPageSize = 20;
  constructor(
    public http: HttpClient,
    @Inject('route') readonly route: string,
    @Inject(API_CONFIG_TOKEN) private config: ApiConfigProvider
  ) {}

  public get apiUrl(): string {
    const value = this.config.apiUrl;
    if (!value) {
      throw new Error('apiUrl has not been configured yet');
    }
    return value;
  }

  public onError: Subject<string> = new Subject();

  public get baseUrl(): string {
    return `${this.apiUrl}/${this.route}`;
  }

  _springDataRestUrlFromHttpParams(params: HttpParams): string {
    let url = this.baseUrl;
    if (params.has('name')) {
      url = this.baseUrl + '/search/findBy';
    }
    if (params.has('factionName')) {
      url = this.baseUrl + '/search/findBy';
    }
    if (params.has('rarityName')) {
      url = this.baseUrl + '/search/findBy';
    }
    if (params.has('typeName')) {
      url = this.baseUrl + '/search/findBy';
    }
    return url;
  }

  getCollection(
    params: HttpParams = new HttpParams(),
    page?: number,
    pageSize?: number
  ): Observable<SpringDataRestResponse<T>> {
    if (!params.has('page') || page != null) {
      params = params.set('page', page || 0);
    }
    if (!params.has('size') || pageSize != null) {
      params = params.set('size', String(pageSize ?? this.defaultPageSize));
    }

    const url = this._springDataRestUrlFromHttpParams(params);
    return this.http.get<SpringDataRestResponse<T>>(url, { params }).pipe(
      map((response: SpringDataRestResponse<T>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.onError.next(error.message);
        return throwError(() => error);
      })
    );
  }

  getSingle(httpParams: HttpParams): Observable<T> {
    console.log(httpParams.toString());

    const id = httpParams.get('id');
    if (id != null && id != '') {
      return this.http.get<T>(`${this.baseUrl}/${id}`).pipe(
        tap(() => this.log(`retrieved single=${this.baseUrl}/${id}`)),
        map((response: T) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.onError.next(error.message);
          return throwError(() => error);
        })
      );
    }

    return this.http.get<SpringDataRestResponse<T>>(`${this.baseUrl}/search/findBy`, { params: httpParams }).pipe(
      map((response: SpringDataRestResponse<T>) => {
        if (response._embedded.data.length != 1) {
          throwError(
            () => new Error(`Entry length is supposed to be 1! Length was instead ${response._embedded.data.length}`)
          );
        }
        return response._embedded.data[0];
      }),
      catchError((error: HttpErrorResponse) => {
        this.onError.next(error.message);
        return throwError(() => error);
      })
    );
  }

  getImageUrl(imageUrlSuffix: string): string {
    return `${this.apiUrl}/images/${imageUrlSuffix}`;
  }

  log(message: string): void {
    console.log(`ApiService: log(): ${message}`);
  }
}
