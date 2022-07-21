/* eslint-disable @typescript-eslint/no-explicit-any */
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkHeaderRowDef } from '@angular/cdk/table';
import { AfterContentInit, ContentChild, Directive, forwardRef, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FixedSizeTableVirtualScrollStrategy } from './fixed-size-table-virtual-scroll-strategy';
import { TableVirtualScrollDataSource } from './table-data-source';

/**
 *
 * @param {TableItemSizeDirective}tableDir The directive
 * @returns {FixedSizeTableVirtualScrollStrategy} TODO
 */
export function _tableVirtualScrollDirectiveStrategyFactory(tableDir: TableItemSizeDirective) {
  return tableDir.scrollStrategy;
}

const stickyHeaderSelector = '.mat-header-row .mat-table-sticky, .mat-header-row.mat-table-sticky';
const stickyFooterSelector = '.mat-footer-row .mat-table-sticky, .mat-header-row.mat-table-sticky';

const defaults = {
  rowHeight: 48,
  headerHeight: 56,
  headerEnabled: true,
  footerHeight: 48,
  footerEnabled: false,
  bufferMultiplier: 0.7,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'cdk-virtual-scroll-viewport[tvsItemSize]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: _tableVirtualScrollDirectiveStrategyFactory,
      deps: [forwardRef(() => TableItemSizeDirective)],
    },
  ],
})
export class TableItemSizeDirective implements OnChanges, AfterContentInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('tvsItemSize')
  rowHeight: string | number = defaults.rowHeight;

  @Input()
  headerEnabled: boolean = defaults.headerEnabled;

  @Input()
  headerHeight: string | number = defaults.headerHeight;

  @Input()
  footerEnabled: boolean = defaults.footerEnabled;

  @Input()
  footerHeight: string | number = defaults.footerHeight;

  @Input()
  bufferMultiplier: string | number = defaults.bufferMultiplier;

  @ContentChild(MatTable, { static: false })
  table!: MatTable<any>;

  scrollStrategy = new FixedSizeTableVirtualScrollStrategy();

  dataSourceChanges = new Subject<void>();

  private stickyPositions!: Map<HTMLElement, number>;

  constructor(private zone: NgZone) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dataSourceChanges.complete();
  }

  private isStickyEnabled(): boolean {
    return (
      !!this.scrollStrategy.viewport &&
      (this.table['_headerRowDefs'] as CdkHeaderRowDef[])
        .map((def) => def.sticky)
        .reduce((prevState, state) => prevState && state, true)
    );
  }

  ngAfterContentInit() {
    console.log('[tvsItemSize] ngAfterContentInit: this.table =', this.table);
    const switchDataSourceOrigin = this.table['_switchDataSource'] as (arg: any) => void;
    this.table['_switchDataSource'] = (dataSource: any) => {
      switchDataSourceOrigin.call(this.table, dataSource);
      this.connectDataSource(dataSource);
    };

    this.connectDataSource(this.table.dataSource);

    this.scrollStrategy.stickyChange
      .pipe(
        filter(() => this.isStickyEnabled()),
        // breaks sticky header on the top. needs investigation
        // delayWhen(() => !this.stickyPositions ? timer(0) : of()),
        tap(() => {
          if (!this.stickyPositions) {
            this.initStickyPositions();
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((stickyOffset) => {
        this.setSticky(stickyOffset);
      });
  }

  connectDataSource(dataSource: any) {
    this.dataSourceChanges.next();
    if (dataSource instanceof TableVirtualScrollDataSource) {
      dataSource.dataToRender$
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.dataSourceChanges),
          takeUntil(this.destroyed$),
          tap((data) => (this.scrollStrategy.dataLength = data.length)),
          switchMap((data) =>
            this.scrollStrategy.renderedRangeStream.pipe(
              map(({ start, end }) => {
                if (typeof start !== 'number' || typeof end !== 'number') {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return data;
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return data.slice(start, end);
                }
              })
            )
          )
        )
        .subscribe((data) => {
          this.zone.run(() => {
            dataSource.dataOfRange$.next(data);
          });
        });
    } else {
      throw new Error('[tvsItemSize] requires TableVirtualScrollDataSource be set as [dataSource] of [mat-table]');
    }
  }

  ngOnChanges() {
    const config = {
      rowHeight: +this.rowHeight || defaults.rowHeight,
      headerHeight: this.headerEnabled ? +this.headerHeight || defaults.headerHeight : 0,
      footerHeight: this.footerEnabled ? +this.footerHeight || defaults.footerHeight : 0,
      bufferMultiplier: +this.bufferMultiplier || defaults.bufferMultiplier,
    };
    this.scrollStrategy.setConfig(config);
  }

  setSticky(offset: number) {
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll(stickyHeaderSelector).forEach((el: Element) => {
      const parent = el.parentElement;
      let baseOffset = 0;
      if (parent != null) {
        if (this.stickyPositions.has(parent)) {
          // TODO
          baseOffset = this.stickyPositions.get(parent) ?? 0;
        }
      }
      (el as HTMLElement).style.top = `${baseOffset - offset}px`;
    });
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll(stickyFooterSelector).forEach((el: Element) => {
      const parent = el.parentElement;
      let baseOffset = 0;
      if (parent != null) {
        if (this.stickyPositions.has(parent)) {
          // TODO
          baseOffset = this.stickyPositions.get(parent) ?? 0;
        }
      }
      (el as HTMLElement).style.bottom = `${-baseOffset + offset}px`;
    });
  }

  private initStickyPositions() {
    this.stickyPositions = new Map<HTMLElement, number>();
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll(stickyHeaderSelector).forEach((el) => {
      const parent = el.parentElement;
      if (parent != null) {
        if (!this.stickyPositions.has(parent)) {
          this.stickyPositions.set(parent, parent.offsetTop);
        }
      }
    });
  }
}
