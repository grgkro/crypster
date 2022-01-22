import { environment } from '../../../src/environments/environment.secret';
import { Injectable } from '@angular/core';
import { User } from './models/user';
import { PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, clusterApiUrl, Connection, Account } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as nacl from 'tweetnacl';

@Injectable({
  providedIn: 'root'
})
export class LambdaService {

  secretKeyCrypster = environment.secretKeyCrypster
  // secretKeyUser = environment.secretKeyUser;
  fromWindowsWallet: Keypair;
  connection;
  // mnemonic: string = bip39.wordlists;

  database: User[] = [
    {
      email: 'e',
    }
  ];

  constructor() { }

  

  async startLambda(mainFormUserInput: any) {
    this.fromWindowsWallet = Keypair.fromSecretKey(this.secretKeyCrypster);
    this.connection = new Connection(clusterApiUrl(mainFormUserInput.connection))
    console.log(this.connection)
    const user = this.getUserFromDatabase(mainFormUserInput.email);
    if (user) {
      console.log(`found this user: ${JSON.stringify(user)}`)
    }
    console.log(mainFormUserInput)
    if (mainFormUserInput.action === 'create a NFT') {
      this.createNFT();
    } else if (mainFormUserInput.action === 'create a currency') {
      this.createCurrency();
    } else if (mainFormUserInput.action === 'create a wallet') {
      const newWallet = await this.createWallet();
      // const newWallet = await this.createWalletFromMnemonic();
      console.log(newWallet)
    }
  }

  getUserFromDatabase(email: string) {
    const user = this.database.filter(user => user.email === email);
    return user;
  }

  createNFT() {
    console.log('starting to create a NFT');
  }

  async createCurrency() {
    console.log('starting to create a currency');
    let SWAB = await Token.createMint(
      this.connection,
      this.fromWindowsWallet,
      this.fromWindowsWallet.publicKey,
      this.fromWindowsWallet.publicKey,
      2,
      TOKEN_PROGRAM_ID,
    );
  }

  async createWallet() {
    console.log('starting to create an account');
    const newWallet = Keypair.generate();
    var airdropSignature = await this.connection.requestAirdrop(
      newWallet.publicKey,
      LAMPORTS_PER_SOL * 1000,
    );
    console.log(airdropSignature)
    console.log('new wallet: ', newWallet);
    return newWallet;
  }

//   async createWalletFromMnemonic() {
//     // this only works in the backend somehow...
//     const bip39 = require('bip39');
//     console.log(bip39);
//     console.log(bip39.wordlists);
//     bip39.getDefaultWordlist();
//     bip39.setDefaultWordlist('korean');
//     const mnemonic = bip39.generateMnemonic();
//     console.log('mnemonic:', mnemonic)
//     const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);
//     console.log(seed)
//     const newAccount = Keypair.fromSeed(seed);
//     console.log(newAccount)
// return newAccount;    
//   }

  getSolanaPrice = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
      {
        method: "GET",
      }
    );
  
    const data = await response.json();
    return data.solana.usd;
  };

}
