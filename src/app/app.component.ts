import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { config as appConfig } from './app.config';
import { HeroDetailComponent, HeroListComponent, WelcomeComponent } from './features';
import { NavigationComponentComponent } from './shared';

@Component({
  standalone: true,
  selector: 'mrlonis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, HeroDetailComponent, HeroListComponent, NavigationComponentComponent, WelcomeComponent],
})
export class AppComponent implements OnInit {
  pageTitle = 'demo-mythic-heroes-angular';

  ngOnInit(): void {
    console.log('AppComponent: ngOnInit(): Starting...');
    console.log(appConfig);
    console.log(window);
  }
}
