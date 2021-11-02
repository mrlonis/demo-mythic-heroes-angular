import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { mixinDisabled, mixinInitialized, ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { SpringDataRestResponse } from '../../../features/hero/spring-data-rest-response.interface';

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export interface PageEvent {
  /** The current page index. */
  pageIndex: number;

  /** The current page size */
  pageSize: number;

  /** The current total number of items being paged */
  total?: number;

  /** All necessary paging and search params to navigate to the specified page */
  params: HttpParams;
}

const _BundlePaginatorMixinBase = mixinDisabled(mixinInitialized(class {}));

type BundlePaging<MythicHero> = Pick<SpringDataRestResponse<MythicHero>, 'page' | '_links' | '_embedded'>;

@Component({
  selector: 'mrlonis-bundle-paginator',
  templateUrl: './bundle-paginator.component.html',
  styleUrls: ['./bundle-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BundlePaginatorComponent<MythicHero> extends _BundlePaginatorMixinBase implements OnChanges {
  // piggy back off of mat-paginator theme for now until I figure out how to build my own
  @HostBinding('class')
  readonly hostClass = 'bundle-paginator mat-paginator';
  @HostBinding('role')
  readonly hostRole = 'group';

  @Input() bundle?: BundlePaging<MythicHero>;
  @Input() showFirstLastButtons = true;
  @Input() pageSize = 20;
  @Input() hidePageSize = false;

  /** Theme color to be used for the underlying form controls. */
  @Input() color: ThemePalette;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  _formFieldAppearance?: MatFormFieldAppearance;

  hasFirst = false;
  hasPrev = false;
  hasNext = false;
  hasLast = false;
  pageIndex = 1;
  isEstimate = false;
  total?: number;
  start?: number;
  end?: number;

  _displayedPageSizeOptions = [10, 20, 50];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bundle']) {
      this.recompute_bundle_props();
    }
  }

  private recompute_bundle_props() {
    this.hasFirst = this.bundle?._links.first !== undefined;
    this.hasPrev = this.bundle?._links.prev !== undefined;
    this.hasNext = this.bundle?._links.next !== undefined;
    this.hasLast = this.bundle?._links.last !== undefined;
    this.total = this.bundle?.page.totalElements;
    const self = this.bundle?._links.self;
    //http://localhost:8000/patient?_total=none&page=1&_count=10
    if (self) {
      const [page, pageSize, params] = this.parseUrl(self.href);
      this.pageIndex = page || 1;
      this.start = pageSize * (this.pageIndex - 1) + 1;
      this.end = this.start + (this.bundle?.page.size || 0) - 1;
      this.isEstimate = params?.get('_total') === 'estimate';
    } else {
      this.start = undefined;
      this.end = undefined;
      this.pageIndex = 1;
      this.isEstimate = false;
    }
  }

  private parseUrl(url: string | URL | undefined): [number, number, URLSearchParams | undefined] {
    const defaultPageSize = 20;
    if (url == null) {
      return [NaN, defaultPageSize, undefined];
    }
    if (typeof url === 'string') {
      url = new URL(url);
    }
    const page = parseInt(url.searchParams.get('page') || '');
    const pageSize = parseInt(url.searchParams.get('_count') || '') || defaultPageSize;
    return [page, pageSize, url.searchParams];
  }

  getRangeLabel(): string {
    if (this.start == null || this.end == null) {
      return '0 - 0';
    }
    let label = `${this.start} - ${this.end}`;
    if (this.total != null) {
      const estimate = this.isEstimate ? 'approx. ' : '';
      label += ` of ${estimate}${this.total}`;
    }
    return label;
  }

  navigate(relation: string): void {
    const link = this.bundle?._links.profile;
    if (!link) {
      console.warn('BundlePaginatorComponent.navigate: relation does not exist:', relation);
      return;
    }
    const [page, pageSize, qs] = this.parseUrl(link.href);
    this.page.emit({
      pageIndex: page,
      pageSize: pageSize,
      total: this.total,
      params: new HttpParams({ fromString: qs?.toString() }),
    });
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize: number): void {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.start ?? 1;

    const newPageIndex = Math.ceil(startIndex / pageSize) || 1;
    const self = this.bundle?._links.self;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, _x, qs] = this.parseUrl(self?.href);
    qs?.set('page', newPageIndex.toString());
    qs?.set('_count', pageSize.toString());
    this.page.emit({
      pageIndex: newPageIndex,
      pageSize: pageSize,
      total: this.total,
      params: new HttpParams({ fromString: qs?.toString() }),
    });
  }
}
