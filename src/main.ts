import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MyPreset } from './styles/prime-ng-preset';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { providePrimeNG } from 'primeng/config';
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    provideRouter(routes)
  ],
}).catch((err) => console.error(err));