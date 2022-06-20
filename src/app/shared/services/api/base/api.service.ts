import type { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Inject, InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import type { BaseResource, SpringDataRestResponse } from '../interfaces';

export interface ApiConfigProvider {
  apiUrl?: string;
}

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfigProvider>('api.config');

export abstract class ApiService<T extends BaseResource> {
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

  getCollection(
    page?: number,
    pageSize?: number,
    params: HttpParams = new HttpParams()
  ): Observable<SpringDataRestResponse<T>> {
    if (!params.has('page') || page != null) {
      params = params.set('page', page || 0);
    }
    if (!params.has('size') || pageSize != null) {
      params = params.set('size', String(pageSize ?? this.defaultPageSize));
    }

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

    return this.http.get<SpringDataRestResponse<T>>(url, { params }).pipe(
      map((response: SpringDataRestResponse<T>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.onError.next(error.message);
        return throwError(error);
      })
    );
  }

  getSingle(id: string): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url).pipe(
      tap(() => this.log(`retrieved single=${url}`)),
      map((response: T) => response),
      catchError((error: HttpErrorResponse) => {
        this.onError.next(error.message);
        return throwError(error);
      })
    );
  }

  getSingleFromHttpParams(httpParams: HttpParams): Observable<T> {
    const url = this.baseUrl;
    return this.http.get<SpringDataRestResponse<T>>(url, { params: httpParams }).pipe(
      map((response: SpringDataRestResponse<T>) => {
        if (response._embedded.data.length != 1) {
          throwError(`Entry length is supposed to be 1! Length was instead ${response._embedded.data.length}`);
        }
        return response._embedded.data[0];
      }),
      catchError((error: HttpErrorResponse) => {
        this.onError.next(error.message);
        return throwError(error);
      })
    );
  }

  getImageUrl(imageUrlSuffix: string): string {
    return `${this.apiUrl}/images/${imageUrlSuffix}`;
  }

  log(message: string): void {
    console.log(message);
  }
}
