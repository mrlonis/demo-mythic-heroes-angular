/* eslint-disable @typescript-eslint/unbound-method */
import { HttpParams } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BundlePaginatorComponent } from './bundle-paginator.component';

type TestResource = MythicHero;
type BundlePaging = BundlePaginatorComponent<TestResource>['bundle'];

describe('BundlePaginatorComponent', () => {
  let component: BundlePaginatorComponent<TestResource>;
  let fixture: ComponentFixture<BundlePaginatorComponent<TestResource>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BundlePaginatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<BundlePaginatorComponent<TestResource>>(BundlePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component.page, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.hasFirst).toBeFalse();
    expect(component.hasLast).toBeFalse();
    expect(component.hasPrev).toBeFalse();
    expect(component.hasNext).toBeFalse();
    expect(component.start).toBeUndefined();
    expect(component.end).toBeUndefined();
    expect(component.total).toBeUndefined();
  });
  const changeBundle = (bundle: BundlePaging) => {
    const old = component.bundle;
    component.bundle = bundle;
    component.ngOnChanges({
      bundle: new SimpleChange(old, bundle, !old),
    });
    fixture.detectChanges();
  };
  const clickButton = (suffix: string) => {
    const button = fixture.debugElement.query(By.css(`button.bundle-paginator-navigation-${suffix}`));
    button.triggerEventHandler('click', {});
    fixture.detectChanges();
    return button;
  };

  it('should compute hasFirst', () => {
    changeBundle({
      link: [{ relation: 'first', url: 'http://whatever?page=1&_count=20' }],
    });
    expect(component.hasFirst).toBeTrue();
  });
  it('should compute hasPrev', () => {
    changeBundle({
      link: [{ relation: 'previous', url: 'http://whatever?page=1&_count=20' }],
    });
    expect(component.hasPrev).toBeTrue();
  });
  it('should compute hasNext', () => {
    changeBundle({
      link: [{ relation: 'next', url: 'http://whatever?page=1&_count=20' }],
    });
    expect(component.hasNext).toBeTrue();
  });
  it('should compute hasLast', () => {
    changeBundle({
      link: [{ relation: 'last', url: 'http://whatever?page=1&_count=20' }],
    });
    expect(component.hasLast).toBeTrue();
  });
  it('should compute start and end for first page', () => {
    changeBundle({
      entry: new Array(8),
      link: [{ relation: 'self', url: 'http://whatever?page=1&_count=8' }],
    });
    expect(component.start).toBe(1);
    expect(component.end).toBe(8);
    expect(component.pageIndex).toBe(1);
    expect(component.getRangeLabel()).toBe('1 - 8');
  });
  it('should compute start and end for next page', () => {
    changeBundle({
      entry: new Array(5),
      link: [{ relation: 'self', url: 'http://whatever?page=3&_count=8' }],
    });
    expect(component.start).toBe(17);
    expect(component.end).toBe(21);
    expect(component.pageIndex).toBe(3);
    expect(component.getRangeLabel()).toBe('17 - 21');
  });
  it('range label should contain total if present', () => {
    changeBundle({
      entry: new Array(5),
      link: [{ relation: 'self', url: 'http://whatever?page=3&_count=8' }],
      total: 100,
    });
    expect(component.total).toBe(100);
    expect(component.getRangeLabel()).toBe('17 - 21 of 100');
  });
  it('should detect count estimate', () => {
    changeBundle({
      entry: new Array(5),
      link: [
        {
          relation: 'self',
          url: 'http://whatever?page=3&_count=8&_total=estimate',
        },
      ],
      total: 21,
    });
    expect(component.isEstimate).toBe(true);
    expect(component.getRangeLabel()).toBe('17 - 21 of approx. 21');
  });
  it('should ignore missing page events', () => {
    clickButton('first');
    clickButton('previous');
    clickButton('next');
    clickButton('last');
    expect(component.page.emit).not.toHaveBeenCalled();
  });
  it('should send first page event', () => {
    changeBundle({
      link: [{ relation: 'first', url: 'http://whatever?page=1&_count=20' }],
    });
    clickButton('first');
    expect(component.page.emit).toHaveBeenCalledOnceWith({
      pageIndex: 1,
      pageSize: 20,
      total: undefined,
      params: new HttpParams({ fromString: 'page=1&_count=20' }),
    });
  });
  it('should send previous page event', () => {
    changeBundle({
      link: [
        {
          relation: 'previous',
          url: 'http://whatever?page=1&_count=20&name=foo',
        },
      ],
    });
    clickButton('previous');
    expect(component.page.emit).toHaveBeenCalledOnceWith({
      pageIndex: 1,
      pageSize: 20,
      total: undefined,
      params: new HttpParams({ fromString: 'page=1&_count=20&name=foo' }),
    });
  });
  it('should send next page event', () => {
    changeBundle({
      link: [
        {
          relation: 'next',
          url: 'http://whatever?page=2&_count=20&search=test',
        },
      ],
    });
    clickButton('next');
    expect(component.page.emit).toHaveBeenCalledOnceWith({
      pageIndex: 2,
      pageSize: 20,
      total: undefined,
      params: new HttpParams({ fromString: 'page=2&_count=20&search=test' }),
    });
  });
  it('should send last page event', () => {
    changeBundle({
      link: [
        {
          relation: 'last',
          url: 'http://whatever?page=99&_count=20&search=test',
        },
      ],
    });
    clickButton('last');
    expect(component.page.emit).toHaveBeenCalledOnceWith({
      pageIndex: 99,
      pageSize: 20,
      total: undefined,
      params: new HttpParams({ fromString: 'page=99&_count=20&search=test' }),
    });
  });

  for (const { testId, currentPage, currentSize, newPage, newSize } of [
    { testId: 1, currentPage: 1, currentSize: 10, newPage: 1, newSize: 20 },
    { testId: 2, currentPage: 2, currentSize: 10, newPage: 1, newSize: 20 },
    { testId: 3, currentPage: 3, currentSize: 10, newPage: 2, newSize: 20 },
    { testId: 4, currentPage: 4, currentSize: 10, newPage: 2, newSize: 20 },
  ]) {
    it(`should send change page size event given [${testId}]`, () => {
      changeBundle({
        link: [
          {
            relation: 'self',
            url: `http://whatever?page=${currentPage}&_count=${currentSize}&search=test`,
          },
        ],
      });
      component._changePageSize(newSize);
      expect(component.page.emit).toHaveBeenCalledOnceWith({
        pageIndex: newPage,
        pageSize: newSize,
        total: undefined,
        params: new HttpParams({
          fromString: `page=${newPage}&_count=${newSize}&search=test`,
        }),
      });
    });
  }
});
