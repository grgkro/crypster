import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CryptoModule } from './crypto/crypto.module';
import { LandingPageModule } from './landing-page/landing-page.module';
 
 
const routes: Routes = [{
    path: 'generate',
    // path: '',
    loadChildren : () => LandingPageModule
 },
 {
    path: "",
    // path: "generate",
    loadChildren : () => CryptoModule
  }]
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }