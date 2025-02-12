<script lang="ts">
    import { onMount } from 'svelte';
    import { StargateClient } from "@cosmjs/stargate";
    import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
    import { get } from "svelte/store";
    import { walletAddress, stargateClientInstance, 
        chainId, rpcAddress, offlineSigner,
        isConnectedLeapWallet, signingClient } from "../stores/blockchainStore";
  
    let isOpen = false;
    let isConnectedLeapWalletResult = false;
    let balance: string = "Loading...";
    const rpcEndpoint = 'http://127.0.0.1:26657';
  
    function togglePanel() {
        isOpen = !isOpen;
    }
  
    async function fetchBalance(address: string) {
        try {
            const client = await StargateClient.connect(get(rpcAddress));
            const balances = await client.getAllBalances(address);
            
            if (balances.length > 0) {
                balance = `${balances[0].amount} ${balances[0].denom}`;
            } else {
                balance = "0 tokens";
            }
            console.log("Balance fetched:", balances);
        } catch (error) {
            console.error("Error fetching balance:", error);
            balance = "Error loading balance";
        }
    }
  
    async function connectLeapWallet() {
        try {
            if (!window.leap) {
                alert("Please install the LeapWallet extension.");
                return;
            }
            const currentChainId = get(chainId);
            if (!currentChainId) {
            console.error("Chain ID is not available.");
            return;
            }

            await window.leap.enable(currentChainId);
            const publicKey = await window.leap.getKey(currentChainId);
            const walletAddressResult = publicKey.bech32Address;
            walletAddress.set(walletAddressResult);
            isConnectedLeapWalletResult = true;
            isConnectedLeapWallet.set(isConnectedLeapWalletResult)
            // Get the OfflineSigner
            const offlineSignerConst = window.leap.getOfflineSigner(currentChainId);
            console.log("OfflineSigner: ", offlineSigner);
            offlineSigner.set(offlineSignerConst); 
            // Offline signer interface allows signing transaction without
            // sharing the private key
            const signClient = await SigningCosmWasmClient.connectWithSigner(
                    get(rpcAddress),
                    offlineSignerConst
                );
                console.log('SigningCosmWasmClient: ', signClient)
                signingClient.set(signClient);
  
            console.log("Connected to LeapWallet:", walletAddress);
  
            // Ask Wallet Balance
            await fetchBalance(walletAddressResult);
        } catch (error) {
            console.error("Error connecting to LeapWallet:", error);
        }
    }
  
    async function disconnectLeapWallet() {
        try {
            const currentChainId = get(chainId);
            if (!window.leap || !currentChainId) {
                console.error("LeapWallet is not available or Chain ID is missing.");
                return;
            }
  
            await window.leap.disconnect(currentChainId);
            walletAddress.set(null);
            stargateClientInstance.set(null);
            isConnectedLeapWalletResult = false;
            isConnectedLeapWallet.set(isConnectedLeapWalletResult)
            balance = "Not Connected";
            console.log("Disconnected from LeapWallet.");
        } catch (error) {
            console.error("Error disconnecting from LeapWallet:", error);
        }
    }
  
    onMount(async () => {
        try {
            const client = await StargateClient.connect(get(rpcAddress));
            chainId.set(await client.getChainId());
            console.log("CosmJS Stargate Connected @", get(chainId));
            stargateClientInstance.set(client);
        } catch (error) {
            console.error("Error connecting to Stargate:", error);
        }
    });
  </script>
  
  <style>
    /* Botão "Connect" fixo no topo direito */
    .connect-btn {
        position: fixed;
        top: 20px;
        right: 20px;
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
        right: 20px;
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
  <button class="connect-btn" on:click={togglePanel}>
    {isConnectedLeapWalletResult ? "Wallet Connected" : "Connect"}
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
            <div class="wallet-option" on:click={disconnectLeapWallet}>🔴 Disconnect LeapWallet</div>
        {:else}
            <div class="wallet-option" on:click={connectLeapWallet}>🔗 Connect LeapWallet</div>
        {/if}
    </div>
  {/if}