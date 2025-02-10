import { writable } from "svelte/store";
import { StargateClient } from "@cosmjs/stargate";

export const isConnectedLeapWallet = writable(false);
export const walletAddress = writable<string | null>(null);
export const balance = writable("Loading...");
export const stargateClient = writable<StargateClient | null>(null);
export const chainId = writable<string | null>(null);