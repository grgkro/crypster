import { Account } from "./account";
import { Currency } from "./currency";
import { NFT } from "./nft";

export interface User {
    email: string;
    NFTs?: NFT;
    Currencies?: Currency;
    Accounts?: Account;
    pubKey?: string;
}