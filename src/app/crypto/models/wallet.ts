import { Status } from "./status";

export interface Wallet {
    pubKey: string;
    secKey: string;
    status: Status;
}