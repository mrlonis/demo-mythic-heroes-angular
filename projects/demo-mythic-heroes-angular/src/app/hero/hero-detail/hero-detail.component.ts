import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../hero.interface';
import { HeroService } from '../hero.service';

@Component({
  selector: 'mrlonis-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  errorMessage = '';
  hero: Hero | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private heroService: HeroService) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    console.log(param);
    if (param) {
      this.getProduct(param);
    }
  }

  getProduct(id: string): void {
    this.heroService.getProduct(id).subscribe({
      next: (hero) => (this.hero = hero),
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
