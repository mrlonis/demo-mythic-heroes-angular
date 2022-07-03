import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Faction, HeroService, MythicHero, MythicHeroesAggressiveCache, Rarity, Type } from '../../../shared';

@Component({
  standalone: true,
  selector: 'mrlonis-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
})
export class HeroDetailComponent implements OnInit {
  errorMessage = '';
  hero: MythicHero | undefined;
  faction: Faction | undefined;
  rarity: Rarity | undefined;
  type: Type | undefined;

  constructor(
    public heroService: HeroService,
    private route: ActivatedRoute,
    private router: Router,
    private cache: MythicHeroesAggressiveCache
  ) {}

  ngOnInit(): void {
    console.log('HeroDetailComponent: ngOnInit(): Starting...');
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.getProduct(param);
    }
  }

  getProduct(id: string): void {
    console.log('HeroDetailComponent: getProduct(): Starting...');
    this.cache.getBy('mythicHero', new HttpParams().set('id', id)).subscribe({
      next: (hero) => {
        console.log('HeroDetailComponent: getProduct()');
        this.hero = hero;
        this.cache.getBy('faction', new HttpParams().set('id', hero.factionId)).subscribe({
          next: (faction) => (this.faction = faction),
          error: (err) => (this.errorMessage = <string>err),
        });
        this.cache.getBy('rarity', new HttpParams().set('id', hero.rarityId)).subscribe({
          next: (rarity) => (this.rarity = rarity),
          error: (err) => (this.errorMessage = <string>err),
        });
        this.cache.getBy('type', new HttpParams().set('id', hero.typeId)).subscribe({
          next: (type) => (this.type = type),
          error: (err) => (this.errorMessage = <string>err),
        });
      },
      error: (err) => {
        console.log('HeroDetailComponent: getProduct(): Inside error of getBy mythicHero');
        console.log(err);
        this.errorMessage = <string>err;
      },
    });
  }

  onBack(): void {
    this.router
      .navigate(['/heroes'])
      .catch((err) => console.log(err))
      .then(() => console.log('this will succeed'))
      .catch(() => 'obligatory catch');
  }

  getImageUrl(): string {
    return this.heroService.getImageUrl(this.hero?.imageUrl ?? '');
  }
}
