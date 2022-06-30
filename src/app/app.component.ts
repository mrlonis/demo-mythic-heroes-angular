import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { config as appConfig, NavigationComponentComponent } from './core';
import { HeroDetailComponent, HeroListComponent, WelcomeComponent } from './features';
import { ApiConfigProvider, API_CONFIG_TOKEN } from './shared';

@Component({
  standalone: true,
  selector: 'mrlonis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, HeroDetailComponent, HeroListComponent, NavigationComponentComponent, WelcomeComponent],
  providers: [
    {
      provide: API_CONFIG_TOKEN,
      useValue: {
        apiUrl: appConfig.apiUrl,
      } as ApiConfigProvider,
    },
  ],
})
export class AppComponent {
  pageTitle = 'demo-mythic-heroes-angular';
}
