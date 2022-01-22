import { environment } from '../../../src/environments/environment.secret';
import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class LambdaService {

  secretKeyCrypster = environment.secretKeyCrypster; 
  secretKeyUser = environment.secretKeyUser; 

  database: User[] = [
    {
      email: 'e',
    }
  ];

  constructor() { }

  startLambda(mainFormUserInput: any) {
    const user = this.getUserFromDatabase(mainFormUserInput.userEmail);
    if (!user) {

    }
    console.log(mainFormUserInput)
    if (mainFormUserInput.action === 'create a NFT') {
      this.createNFT();
    } else if (mainFormUserInput.action === 'create a currency') {
      this.createCurrency();
    } else if (mainFormUserInput.action === 'create an account') {
      this.createAccount();
    }
  }

  getUserFromDatabase(email: string) {
    const user = this.database.filter(user => user.email === email);
    return user;
  }

  createNFT() {
    console.log('starting to create a NFT');
  }

  createCurrency() {
    console.log('starting to create a currency');
  }

  createAccount() {
    console.log('starting to create an account');
  }
}
