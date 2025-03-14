import type { IProvider } from '@web3auth/base';
import { SigningStargateClient, StargateClient, calculateFee, GasPrice } from '@cosmjs/stargate';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import type { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { Buffer } from 'buffer';
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

	/**
	 * Constructor
	 * @param provider Web3Auth provider
	 */
	constructor(provider: IProvider) {
		this.provider = provider;
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
			if (error instanceof Error) {
				throw new Error(`Failed to get chain ID: ${error.message}`);
			}
			throw new Error('Failed to get chain ID');
		}
	}

	/**
	 * Get the user's account address
	 * @returns Promise with account address
	 */
	async getAccounts(): Promise<string> {
		try {
			const privateKeyHex = await this.getPrivateKey();
			const privateKey = Buffer.from(privateKeyHex, 'hex');
			const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, 'cosmos');
			return (await wallet.getAccounts())[0].address;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to get accounts: ${error.message}`);
			}
			throw new Error('Failed to get accounts');
		}
	}

	/**
	 * Get the user's balance
	 * @returns Promise with balance as JSON string
	 */
	async getBalance(): Promise<readonly Coin[]> {
		try {
			const client = await StargateClient.connect(rpcAddressFromStore);
			const privateKeyHex = await this.getPrivateKey();
			const privateKey = Buffer.from(privateKeyHex, 'hex');
			const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, 'cosmos');
			const address = (await wallet.getAccounts())[0].address;
			return (await client.getAllBalances(address));
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to get balance: ${error.message}`);
			}
			throw new Error('Failed to get balance');
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
			// For more accurate gas estimation, we could use the recipient and amount
			// to simulate the transaction, but for simplicity we'll use default values
			console.log(`Estimating gas for sending ${amount} to ${recipient}`);

			// Default gas values
			const defaultGas = '100000';
			const gasPrice = GasPrice.fromString(`0.025${ticker.toLowerCase()}`);

			// Calculate fee based on gas
			const fee = calculateFee(parseInt(defaultGas), gasPrice);

			return {
				gas: defaultGas,
				fee: fee.amount[0].amount
			};
		} catch (error) {
			console.error('Gas estimation error:', error);
			// Return default values if estimation fails
			return {
				gas: '100000',
				fee: '5000'
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
		try {
			if (!recipient) {
				throw new Error('Recipient address is required');
			}

			if (!amount || parseFloat(amount) <= 0) {
				throw new Error('Amount must be greater than 0');
			}

			await StargateClient.connect(rpcAddressFromStore);
			const privateKeyHex = await this.getPrivateKey();
			const privateKey = Buffer.from(privateKeyHex, 'hex');
			const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, 'cosmos');
			const fromAddress = (await wallet.getAccounts())[0].address;

			// Get current balance to check if sufficient funds
			const client = await StargateClient.connect(rpcAddressFromStore);
			const balances = await client.getAllBalances(fromAddress);
			const stakeBalance = balances.find((coin) => coin.denom === 'stake');

			if (!stakeBalance) {
				throw new Error('No STAKE tokens found in wallet');
			}

			// Convert amount to microSTAKE (6 decimal places)
			const amountInMicroStake = (parseFloat(amount) * 1000000).toString();

			// Check if user has enough balance
			if (parseInt(stakeBalance.amount) < parseInt(amountInMicroStake)) {
				throw new Error(
					`Insufficient balance. You have ${parseInt(stakeBalance.amount) / 1000000} STAKE`
				);
			}

			const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
				return DirectSecp256k1Wallet.fromKey(privateKey, 'cosmos');
			};
			const signer: OfflineDirectSigner = await getSignerFromKey();

			const signingClient = await SigningStargateClient.connectWithSigner(rpcAddressFromStore, signer);

			// Estimate gas and fee
			const { gas, fee } = await this.estimateGas(recipient, amountInMicroStake);

			const result = await signingClient.sendTokens(
				fromAddress,
				recipient,
				[{ denom: 'stake', amount: amountInMicroStake }],
				{
					amount: [{ denom: 'stake', amount: fee }],
					gas: gas
				}
			);

			return JSON.stringify({
				transactionHash: result.transactionHash,
				height: result.height,
				amount: `${amount} STAKE`,
				recipient: recipient,
				fee: `${parseInt(fee) / 1000000} STAKE`
			});
		} catch (error) {
			if (error instanceof Error) {
				return JSON.stringify({ error: error.message });
			}
			return JSON.stringify({ error: 'Unknown error occurred' });
		}
	}

	/**
	 * Get the private key from the provider
	 * @returns Promise with private key
	 */
	async getPrivateKey(): Promise<string> {
		try {
			return (await this.provider.request({
				method: 'private_key'
			})) as string;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to get private key: ${error.message}`);
			}
			throw new Error('Failed to get private key');
		}
	}
}