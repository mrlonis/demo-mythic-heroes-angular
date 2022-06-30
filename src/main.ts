import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HeroDetailComponent, HeroDetailGuard, HeroListComponent, WelcomeComponent } from './app';
import { AppComponent } from './app/app.component';
import { config as appConfig } from './app/core';
import { ApiConfigProvider, API_CONFIG_TOKEN } from './app/shared';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'heroes', component: HeroListComponent },
  {
    path: 'heroes/:id',
    canActivate: [HeroDetailGuard],
    component: HeroDetailComponent,
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: API_CONFIG_TOKEN,
      useValue: {
        apiUrl: appConfig.apiUrl,
      } as ApiConfigProvider,
    },
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
