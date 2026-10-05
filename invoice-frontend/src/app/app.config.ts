import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Keep route components lazy for the initial visit, then preload them once the
    // app is idle so moving between sections is immediate on subsequent clicks.
    provideRouter(routes, withPreloading(PreloadAllModules)), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
};
