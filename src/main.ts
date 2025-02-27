import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { ParsonsProblemComponent } from './app/parsons-problem/parsons-problem.component';
import { LoginComponent } from './app/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { BlankComponent } from './app/blank-parsons/blank-parsons.component';

const routes: Route[] = [
  { path: '', component: LoginComponent },                      // Root route for login
  { path: 'landing', component: LandingPageComponent },         // Route for landing page
  { path: 'parsons', component: ParsonsProblemComponent },      // Route for Parsons Problem component
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
         positionClass: 'toast-bottom-left', // Move to bottom-right
        toastClass: 'ngx-toastr custom-toast', // Add custom class
        preventDuplicates: true,         // Prevent duplicate toasts
 	progressBar: true, // Optional: add a progress bar
      })
    ),
    provideRouter(routes),
  ],
})
  .then(() => console.log('Application started successfully'))
  .catch((err) => console.error('Error starting application:', err));