import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailModule } from './hero-detail.module';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
