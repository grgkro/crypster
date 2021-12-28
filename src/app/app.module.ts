import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LandingPageModule } from './landing-page/landing-page.module';
import { GenerateCryptoModule } from './generate-crypto/generate-crypto.module';
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  { path: 'home', component: GenerateCryptoModule(HomeComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LandingPageModule,
    GenerateCryptoModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
