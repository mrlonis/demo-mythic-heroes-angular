import { HttpParams } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BaseResource, SpringDataRestResponse } from '../../services/api/interfaces';
import { SimpleListComponent, SimpleListComponentDataSource } from './simple-list.component';

class ExampleSimpleListDataSource extends SimpleListComponentDataSource<BaseResource, { a: string; b: string }> {
  displayedColumns: Array<'a' | 'b'> = ['a', 'b'];
  columnInfo = { a: { name: 'A' }, b: { name: 'B' } };
  /* eslint-disable @typescript-eslint/no-unused-vars */
  mapEntry(_x: BaseResource): { a: string; b: string; name: string } {
    return { a: 'a', b: 'b', name: 'example' };
  }
  getCollection(_index: number, _size: number, _params?: HttpParams): Observable<SpringDataRestResponse<BaseResource>> {
    const a: SpringDataRestResponse<BaseResource> = {
      _embedded: {
        data: [{ id: 'id', name: 'name', imageUrl: 'imageUrl', _links: { self: { href: '' }, item: { href: '' } } }],
      },
      _links: {
        self: { href: '' },
        profile: { href: '' },
        search: { href: '' },
      },
      page: {
        size: 0,
        totalElements: 100,
        totalPages: 3,
        number: 1,
      },
    };
    return of(a).pipe(delay(200));
  }
}

describe('SimpleListComponent', () => {
  let component: SimpleListComponent<BaseResource, { a: string; b: string }>;
  let fixture: ComponentFixture<SimpleListComponent<BaseResource, { a: string; b: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
      declarations: [SimpleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListComponent) as unknown as ComponentFixture<
      SimpleListComponent<BaseResource, { a: string; b: string }>
    >;
    fixture.componentInstance.data = new ExampleSimpleListDataSource();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
