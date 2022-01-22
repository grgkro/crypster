import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { RouterModule, Routes } from '@angular/router'
import { CryptoModule } from '../crypto/crypto.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      
    {
      path: "",
      // path: "generate",
      loadChildren : () => CryptoModule
    },
    {
      path: "generate",
      // path: "",
      component: LandingComponent,
    },
  ]),
    CryptoModule
  ],
  exports: [LandingComponent]
})
export class LandingPageModule { }
