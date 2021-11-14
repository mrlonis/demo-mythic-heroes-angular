import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { config as appConfig } from './core/app-config';
import { HeroModule } from './features/hero/hero.module';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { ApiConfigProvider, API_CONFIG_TOKEN } from './shared/services/api/base';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    SharedModule,
    HeroModule,
  ],
  providers: [
    {
      provide: API_CONFIG_TOKEN,
      useValue: {
        apiUrl: appConfig.apiUrl,
      } as ApiConfigProvider,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
