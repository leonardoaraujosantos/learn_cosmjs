/*

OfflineSigner interface allows something that can sign a transaction with a wallet without sharing the private key
*/
import { OfflineSigner } from "@cosmjs/proto-signing";
declare global {
    interface Window {
      leap?: {
        enable: (chainId: string) => Promise<void>;
        getKey: (chainId: string) => Promise<{ bech32Address: string }>;
        disconnect: (chainId: string) => Promise<void>;
        getOfflineSigner: (chainId: string) => OfflineSigner;
      };
    }
  }
  
  export {};