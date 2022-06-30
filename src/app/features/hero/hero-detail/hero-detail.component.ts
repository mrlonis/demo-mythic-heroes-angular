import { HttpClientModule, HttpParams } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Faction, HeroService, MythicHero, MythicHeroesAggressiveCache, Rarity, Type } from '../../../shared';

@Component({
  standalone: true,
  selector: 'mrlonis-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [HttpClientModule, MatCardModule, RouterModule],
})
export class HeroDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
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
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.getProduct(param);
    }
  }

  getProduct(id: string): void {
    this.cache.getBy('mythicHero', new HttpParams().set('id', id)).subscribe({
      next: (hero) => {
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
      error: (err) => (this.errorMessage = <string>err),
    });
  }

  onBack(): void {
    this.router
      .navigate(['/heroes'])
      .catch((err) => console.log(err))
      .then(() => console.log('this will succeed'))
      .catch(() => 'obligatory catch');
  }
}
