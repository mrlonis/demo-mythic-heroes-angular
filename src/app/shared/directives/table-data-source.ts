import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, merge, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export class TableVirtualScrollDataSource<T> extends MatTableDataSource<T> {
  public dataToRender$!: Subject<T[]>;
  public dataOfRange$!: Subject<T[]>;
  private streamsReady = false;

  _updateChangeSubscription() {
    this.initStreams();
    const _sort: MatSort | null = this['_sort'] as MatSort | null;
    const _paginator: MatPaginator | null = this['_paginator'] as MatPaginator | null;
    const _internalPageChanges: Subject<void> = this['_internalPageChanges'] as Subject<void>;
    const _filter: BehaviorSubject<string> = this['_filter'] as BehaviorSubject<string>;
    const _renderData: BehaviorSubject<T[]> = this['_renderData'] as BehaviorSubject<T[]>;

    const sortChange: Observable<Sort | null | void> = _sort ? merge(_sort.sortChange, _sort.initialized) : of(null);
    const pageChange: Observable<PageEvent | null | void> = _paginator
      ? merge(_paginator.page, _internalPageChanges, _paginator.initialized)
      : of(null);
    const dataStream: Observable<T[]> = this['_data'] as Observable<T[]>;
    const filteredData = combineLatest([dataStream, _filter]).pipe(map(([data]) => this._filterData(data)));
    const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));

    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = new Subscription();
    this._renderChangesSubscription.add(paginatedData.subscribe((data) => this.dataToRender$.next(data)));
    this._renderChangesSubscription.add(this.dataOfRange$.subscribe((data) => _renderData.next(data)));
  }

  private initStreams() {
    if (!this.streamsReady) {
      this.dataToRender$ = new ReplaySubject<T[]>(1);
      this.dataOfRange$ = new ReplaySubject<T[]>(1);
      this.streamsReady = true;
    }
  }
}
