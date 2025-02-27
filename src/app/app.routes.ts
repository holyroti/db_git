

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ParsonsProblemComponent } from './parsons-problem/parsons-problem.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Default route
  { path: 'parsons', component: ParsonsProblemComponent } // Route to the Parsons component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
