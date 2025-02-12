import { writable } from "svelte/store";
import { StargateClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { OfflineSigner } from "@cosmjs/proto-signing";

export const isConnectedLeapWallet = writable(false);
export const walletAddress = writable<string | null>(null);
export const balance = writable("Loading...");
export const rpcAddress = writable("http://127.0.0.1:26657");
export const stargateClientInstance = writable<StargateClient | null>(null);
export const chainId = writable<string | null>(null);
export const signingClient = writable<SigningCosmWasmClient | null>(null);
export const offlineSigner = writable<OfflineSigner | null>(null);