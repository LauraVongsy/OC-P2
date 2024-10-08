import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { routes } from './app/app-routing.module';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, ROUTES } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

if (environment.production) {
  enableProdMode();
}

  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(HttpClientModule), provideAnimationsAsync(),
    ]
  }).catch(err => console.error(err));