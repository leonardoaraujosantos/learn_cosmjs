import { writable } from "svelte/store";
import { StargateClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const isConnectedLeapWallet = writable(false);
export const walletAddress = writable<string | null>(null);
export const balance = writable("Loading...");
export const stargateClientInstance = writable<StargateClient | null>(null);
export const chainId = writable<string | null>(null);
export const signingClient = writable<SigningCosmWasmClient | null>(null);