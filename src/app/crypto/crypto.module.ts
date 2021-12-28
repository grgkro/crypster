import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorComponent } from './generator/generator.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [GeneratorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "generate",
        component: GeneratorComponent,
      }
      ]),
  ]
})
export class CryptoModule { }
