import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LambdaService } from '../lambda.service';
// import { ArweaveSigner, createData } from "arbundles";
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {

  mainForm: FormGroup;
  chainsList = [
    {
      name:'Solana',
    },{
      name:'Ethereum',
    },{
      name:'Algorand',
    }
  ]
  actionList = [
    {
      name:'create a NFT',
    },
    {
      name:'create a currency',
    },
    {
      name:'create a wallet',
    }
  ]
  connectionList = [
    {
      name:'devnet',
    },
    {
      name:'testnet',
    },
    {
      name:'mainnet-beta',
    }
  ]
  userKeypairList = [
    {
      name:'create',
    },
    {
      name:'exists',
    }
  ]
  constructor(
    private fb: FormBuilder,
    private _lambda: LambdaService
  ) { 
    this.mainForm = fb.group({
      chain: ['Solana', [Validators.required]], 
      action: ['create a wallet', [Validators.required]],  // 0 = NFT, 1 = currency
      connection: ['devnet', [Validators.required]],
      userKeypair: ['create', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  ngOnInit(): void {
    
  }

  submit(){
    console.log(this.mainForm.value.action);
    this._lambda.startLambda(this.mainForm.value)
  }

  get chain() { return this.mainForm.get('chain').value; }

  // async uploadImageToArweave() {
  //   // 1. Upload image to Arweave
  //   const data = fs.readFileSync('./code/nfts/arweave-upload/lowres-dog.png');

  //   const transaction = await arweave.createTransaction({
  //       data: data
  //   });

  //   transaction.addTag('Content-Type', 'image/png');

  //   const wallet = await arweave.wallets.getWalletFromFile('wallet.json');
  //   await arweave.transactions.sign(transaction, wallet);

  //   const response = await arweave.transactions.post(transaction);
  //   console.log(response);

  //   const { id } = response;
  //   const imageUrl = id ? `https://arweave.net/${id}` : undefined;

  //   // 2. Upload metadata to Arweave

  //   const metadataRequest = JSON.stringify(metadata);

  //   const metadataTransaction = await arweave.createTransaction({
  //       data: metadataRequest
  //   });

  //   metadataTransaction.addTag('Content-Type', 'application/json');

  //   await arweave.transactions.sign(metadataTransaction, wallet);

  //   await arweave.transactions.post(metadataTransaction); 
  // }

  // const sendToBundler = async () => {
  //   const jwk = JSON.parse(process.env.KEY);
  //   const signer = new ArweaveSigner(jwk);
  //   const item = createData("hello", signer);
  //   await item.sign(signer);
  //   // This transaction ID is guaranteed to be usable
  //   console.log("item id", item.id);

  //   const response = await item.sendToBundler("http://bundler.arweave.net:10000");
  //   console.log("bundler response status", response.status);

  //   // Read back data
  //   // Don't use arweave.transactions.getData, data is not available instantly via
  //   // that API (it results in a TX_PENDING error). Here's the explanation from Discord:
  //   //
  //   // but essentially if /{txid} returns 202
  //   // it's "pending"
  //   // which with regular txs is true
  //   // but it also returns 202 for unseeded Bundlr txs
  //   // so the data exists in Bundlr - but not on L1 (Arweave)
  //   const data = await axios.get(`https://arweave.net/${item.id}`);
  //   console.log("data", data.data);
  // };

  // sendToBundler();

  //   Reading data uploaded with arbundles
  // This is simple, and is covered in the code above—just run 
  // const data = await axios.get(`https://arweave.net/${item.id}`);
  // https://pencilflip.medium.com/how-to-use-arweave-to-store-and-access-nft-metadata-part-2-21cb87f4091e
}
