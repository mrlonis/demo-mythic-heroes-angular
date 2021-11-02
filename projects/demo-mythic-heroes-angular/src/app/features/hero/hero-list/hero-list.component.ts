import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MythicHero } from '../hero.interface';
import { HeroService } from '../hero.service';

@Component({
  selector: 'mrlonis-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
})
export class HeroListComponent implements OnInit, OnDestroy {
  pageTitle = 'hero List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  sub!: Subscription;

  private _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredHeroes = this.performFilter(value);
  }

  filteredHeroes: MythicHero[] = [];
  heroes: MythicHero[] = [];

  constructor(private heroService: HeroService) {}

  performFilter(filterBy: string): MythicHero[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.heroes.filter((hero: MythicHero) => hero.heroName.toLocaleLowerCase().includes(filterBy));
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.sub = this.heroService.getHeroes().subscribe({
      next: (springDataResponse) => {
        this.heroes = springDataResponse._embedded.data;
        this.filteredHeroes = this.heroes;
      },
      error: (err) => (this.errorMessage = <string>err),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'hero List: ' + message;
  }
}