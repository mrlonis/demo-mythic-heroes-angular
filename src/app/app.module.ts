import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { config as appConfig, NavigationComponentComponent } from './core';
import type { ApiConfigProvider } from './shared/services/api/base';
import { API_CONFIG_TOKEN } from './shared/services/api/base';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule, NavigationComponentComponent],
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
