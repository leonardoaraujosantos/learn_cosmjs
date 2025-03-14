import type { IProvider } from '@web3auth/base';
import { SigningStargateClient, StargateClient, calculateFee, GasPrice } from '@cosmjs/stargate';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import type { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { fromHex } from '@cosmjs/encoding';
import { get } from "svelte/store";
import { rpcAddress } from "../../stores/BlockchainStore";
import { WEB3AUTH_CHAIN_CONFIG } from "./web3AuthConfig";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const rpcAddressFromStore = get(rpcAddress);
const ticker = WEB3AUTH_CHAIN_CONFIG.ticker;

/**
 * CosmosRPC class for interacting with the Cosmos blockchain
 */
export default class CosmosRPC {
  private provider: IProvider;
  private offlineSigner: OfflineDirectSigner | null = null;

  /**
   * Constructor
   * @param provider Web3Auth provider
   */
  constructor(provider: IProvider) {
    this.provider = provider;
  }

  /**
   * Initialize the OfflineSigner
   */
  private async initOfflineSigner(): Promise<void> {
    if (!this.offlineSigner) {
      const privateKeyHex = await this.getPrivateKey();
      const privateKey = fromHex(privateKeyHex);
      this.offlineSigner = await DirectSecp256k1Wallet.fromKey(privateKey, 'cosmos');
    }
  }
  
  public async getOfflineSigner(): Promise<OfflineDirectSigner> {
    await this.initOfflineSigner();
    if (!this.offlineSigner) {
      throw new Error('OfflineSigner initialization failed');
    }
    return this.offlineSigner;
  }

  /**
   * Get the chain ID
   * @returns Promise with chain ID
   */
  async getChainId(): Promise<string> {
    try {
      const client = await StargateClient.connect(rpcAddressFromStore);
      const chainId = await client.getChainId();
      return chainId.toString();
    } catch (error) {
      throw new Error(`Failed to get chain ID: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the user's account address
   * @returns Promise with account address
   */
  async getAccounts(): Promise<string> {
    await this.initOfflineSigner();
    if (!this.offlineSigner) {
      throw new Error('OfflineSigner is not initialized');
    }
    const accounts = await this.offlineSigner.getAccounts();
    return accounts[0].address;
  }

  /**
   * Get the user's balance
   * @returns Promise with balance as JSON string
   */
  async getBalance(): Promise<readonly Coin[]> {
    try {
      const client = await StargateClient.connect(rpcAddressFromStore);
      const address = await this.getAccounts();
      return await client.getAllBalances(address);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Estimate gas for a transaction
   * @param recipient Recipient address
   * @param amount Amount to send
   * @returns Promise with gas and fee
   */
  async estimateGas(recipient: string, amount: string): Promise<{ gas: string; fee: string }> {
    try {
      console.log(`Estimating gas for sending ${amount} to ${recipient}`);
      const defaultGas = '100000';
      const gasPrice = GasPrice.fromString(`0.025${ticker.toLowerCase()}`);
      const fee = calculateFee(parseInt(defaultGas), gasPrice);
      return {
        gas: defaultGas,
        fee: fee.amount[0].amount,
      };
    } catch (error) {
      console.error('Gas estimation error:', error);
      return {
        gas: '100000',
        fee: '5000',
      };
    }
  }

  /**
   * Send a transaction
   * @param recipient Recipient address
   * @param amount Amount to send
   * @returns Promise with transaction result as JSON string
   */
  async sendTransaction(recipient: string, amount: string): Promise<string> {
    console.log("Triggered sendTransaction!!!")
	try {
      if (!recipient) {
        throw new Error('Recipient address is required');
      }
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      await this.initOfflineSigner();
      if (!this.offlineSigner) {
        throw new Error('OfflineSigner is not initialized');
      }
      const fromAddress = await this.getAccounts();
      const client = await StargateClient.connect(rpcAddressFromStore);
      const balances = await client.getAllBalances(fromAddress);
      const stakeBalance = balances.find((coin) => coin.denom === 'stake');

      if (!stakeBalance) {
        throw new Error('No STAKE tokens found in wallet');
      }

      const amountInMicroStake = (parseFloat(amount) * 1_000_000).toString();

      if (parseInt(stakeBalance.amount) < parseInt(amountInMicroStake)) {
        throw new Error(
          `Insufficient balance. You have ${parseInt(stakeBalance.amount) / 1_000_000} STAKE`
        );
      }

      const signingClient = await SigningStargateClient.connectWithSigner(rpcAddressFromStore, this.offlineSigner);

      const { gas, fee } = await this.estimateGas(recipient, amountInMicroStake);

      const result = await signingClient.sendTokens(
        fromAddress,
        recipient,
        [{ denom: 'stake', amount: amountInMicroStake }],
        {
          amount: [{ denom: 'stake', amount: fee }],
          gas: gas,
        }
      );

      return JSON.stringify({
        transactionHash: result.transactionHash,
        height: result.height,
        amount: `${amount} STAKE`,
        recipient: recipient,
        fee: `${parseInt(fee) / 1_000_000} STAKE`,
      });
    } catch (error) {
      return JSON.stringify({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Get the private key from the provider
   * @returns Promise with private key
   */
  private async getPrivateKey(): Promise<string> {
    try {
      return (await this.provider.request({
        method: 'private_key',
      })) as string;
    } catch (error) {
      throw new Error(`Failed to get private key: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}