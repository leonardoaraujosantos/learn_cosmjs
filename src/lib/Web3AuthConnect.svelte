<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from "svelte/store";
    import { walletAddress, chainId, cosmosRPCWeb3AuthProvider,
        isConnectedLeapWallet } from "../stores/blockchainStore";
    
    import { Web3Auth } from "@web3auth/modal";
    import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
    import { WEB3AUTH_NETWORK } from "@web3auth/base";
    import { WEB3AUTH_CHAIN_CONFIG } from "./services/web3AuthConfig";
    import CosmosRPC from './services/cosmosRPC'
  
    let isOpen = false;
    let isConnectedLeapWalletResult = false;
    let balance: string = "Loading...";
    export const clientId = "BL-9vEhzS0Z7PAi0z0yT6pmQMjwn61DYc5R5qLpEpnQ4h8POuKLrVmO5VUw1WBTctLN2VkzMbq8M00FL2Xf6GFA"
    let web3auth: Web3Auth;

    function togglePanel() {
        isOpen = !isOpen;
    }

    async function fetchBalance() {
        try {
            const client = get(cosmosRPCWeb3AuthProvider);
            if (client){
                const balances = await client.getBalance()
                if (balances.length > 0) {
                    balance = `${balances[0].amount} ${balances[0].denom}`;
                } else {
                    balance = "0 tokens";
                }
                console.log("Balance fetched:", balance);
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            balance = "Error loading balance";
        }
    }
  
  
    async function connectWeb3Auth() {
        try {
            const privateKeyProvider = new CommonPrivateKeyProvider({
                config: { chainConfig: WEB3AUTH_CHAIN_CONFIG },
            });
            web3auth = new Web3Auth({
                // Get it from Web3Auth Dashboard
                clientId,
                web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
                privateKeyProvider: privateKeyProvider,
            });
            // Initialize for PnP Modal SDK
            await web3auth.initModal();
            // Trigger the login
            await web3auth.connect();
            // Get the provider
            const provider = web3auth.provider;
            // Ask User Info (Public Info)
            const user = await web3auth.getUserInfo();
            console.log(user);
            if (provider) {
                console.log(provider);
                // Now let's use the custom CosmosRPC provider implementation
				const cosmosRPC = new CosmosRPC(provider);
                const publicAddress = await cosmosRPC.getAccounts()
                chainId.set(await cosmosRPC.getChainId());
                walletAddress.set(publicAddress);
                cosmosRPCWeb3AuthProvider.set(cosmosRPC)
                isConnectedLeapWalletResult = true;
                isConnectedLeapWallet.set(isConnectedLeapWalletResult)
                // Ask Wallet Balance
                await fetchBalance();
            }
            
            
            // After we get the user provider we need to set on our custom CosmosSDK provider
        } catch (error) {
            console.error("Error connecting to LeapWallet:", error);
        }
    }
  
    async function disconnectWeb3Auth() {
        try {
            const currentChainId = get(chainId);
            await web3auth.logout();
            
            walletAddress.set(null);
            isConnectedLeapWalletResult = false;
            isConnectedLeapWallet.set(isConnectedLeapWalletResult)
            cosmosRPCWeb3AuthProvider.set(null)
            balance = "Not Connected";
            console.log("Disconnected from Web3Auth");
        } catch (error) {
            console.error("Error disconnecting from LeapWallet:", error);
        }
    }
  
    onMount(async () => {
        try {
            console.log("Web3Auth mount ...");
        } catch (error) {
            console.error("Error connecting to Web3Auth:", error);
        }
    });
  </script>
  
  <style>
    /* Botão "Connect" fixo no topo direito */
    .connect-btn-social {
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 10px 16px;
        background: #a855f7;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        z-index: 50;
    }
  
    /* Contêiner do menu */
    .menu-container {
        position: fixed;
        top: 60px;
        left: 20px;
        width: 350px;
        background: #18181b;
        color: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        z-index: 50;
        border-radius: 8px;
        overflow: hidden;
        padding: 15px;
    }
  
    /* Cabeçalho */
    .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
  
    .close-btn {
        background: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        border: none;
    }
  
    /* Opções */
    .wallet-option {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        background: #27272a;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
        margin-top: 10px;
    }
  
    .wallet-option:hover {
        background: #323232;
    }
  
    /* Endereço e saldo */
    .wallet-info {
        text-align: center;
        padding: 10px;
        background: #323232;
        border-radius: 6px;
        margin-top: 10px;
        font-size: 14px;
        color: white;
        word-break: break-word;
    }
  </style>
  
  <!-- Botão "Connect" fixo no topo direito -->
  <button class="connect-btn-social" on:click={togglePanel}>
    {isConnectedLeapWalletResult ? "Wallet Connected" : "Connect Social"}
  </button>

  <!-- Menu suspenso abaixo do botão -->
  {#if isOpen}
    <div class="menu-container">
        <div class="menu-header">
            Connect a Wallet
            <button class="close-btn" on:click={togglePanel}>✖</button>
        </div>
  
        {#if isConnectedLeapWalletResult}
            <div class="wallet-info">
                <p>🔗 Address:</p>
                <p>{get(walletAddress)}</p>
            </div>
            <div class="wallet-info">
                <p>💰 Balance:</p>
                <p>{balance}</p>
            </div>
            <div class="wallet-option" on:click={disconnectWeb3Auth}>🔴 Disconnect WebAuth3</div>
        {:else}
            <div class="wallet-option" on:click={connectWeb3Auth}>🔗 Connect WebAuth3</div>
        {/if}
    </div>
  {/if}
