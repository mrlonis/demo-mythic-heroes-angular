import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero.interface';
import { SpringDataRestResponse } from './spring-data-rest-response.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private productUrl = 'http://localhost:9001/api/mythicHeroes?page=0&size=37&sort=heroName';

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<SpringDataRestResponse> {
    console.log('getHeroes(): Starting...');
    return this.http.get<SpringDataRestResponse>(this.productUrl).pipe(
      tap((data) => console.log('All: ', JSON.stringify(data))),
      catchError((error) => this.handleError(<HttpErrorResponse>error))
    );
  }

  // Get one product
  // Since we are working with a json file, we can only retrieve all products
  // So retrieve all products and then find the one we want using 'map'
  getProduct(id: string): Observable<Hero | undefined> {
    console.log('getProduct(): Starting...');
    return this.getHeroes().pipe(
      map((products: SpringDataRestResponse) => products._embedded.mythicHeroes.find((p) => p.heroId == id))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log('handleError(): Starting...');
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
