declare global {
    interface Window {
      leap?: {
        enable: (chainId: string) => Promise<void>;
        getKey: (chainId: string) => Promise<{ bech32Address: string }>;
        disconnect: (chainId: string) => Promise<void>;
      };
    }
  }
  
  export {};