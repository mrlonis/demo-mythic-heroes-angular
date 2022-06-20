import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { HeroListModule } from './hero-list.module';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
