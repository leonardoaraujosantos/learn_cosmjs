<script lang="ts">
  import { onMount } from 'svelte';
  import { StargateClient } from "@cosmjs/stargate";

  let isOpen = false;
  let isConnectedLeapWallet = false;
  let walletAddress: string | null = null;
  let chainId: string | null = null;
  let allBalances: any = null;
  let accountInfo: any = null;
  const rpcEndpoint = 'http://127.0.0.1:26657';

  function togglePanel() {
      isOpen = !isOpen;
  }

  onMount(async () => {
      try {
          const stargateClient = await StargateClient.connect(rpcEndpoint);
          chainId = await stargateClient.getChainId();
          console.log("CosmJS Stargate Connected @", chainId);
      } catch (error) {
          console.error('Error connecting to Stargate:', error);
      }
  });

  async function connectLeapWallet() {
      try {
          if (!window.leap) {
              alert("Please install the LeapWallet extension.");
              return;
          }

          if (!chainId) {
              console.error("Chain ID is not set.");
              return;
          }

          await window.leap.enable(chainId);
          const publicKey = await window.leap.getKey(chainId);
          walletAddress = publicKey.bech32Address;
          isConnectedLeapWallet = true;

          console.log("Connected to LeapWallet:", walletAddress);
      } catch (error) {
          console.error("Error connecting to LeapWallet:", error);
      }
  }

  async function disconnectLeapWallet() {
      try {
          if (!window.leap || !chainId) {
              console.error("LeapWallet is not available or Chain ID is missing.");
              return;
          }

          await window.leap.disconnect(chainId);
          walletAddress = null;
          isConnectedLeapWallet = false;
          console.log("Disconnected from LeapWallet.");
      } catch (error) {
          console.error("Error disconnecting from LeapWallet:", error);
      }
  }
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

  /* Contêiner para alinhar o menu abaixo do botão */
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
  }

  /* Cabeçalho do menu */
  .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #27272a;
  }

  /* Botão de fechar */
  .close-btn {
      background: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      border: none;
  }

  /* Opções da carteira */
  .wallet-option {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      background: #27272a;
      border-bottom: 1px solid #323232;
      cursor: pointer;
      transition: background 0.2s;
  }

  .wallet-option:hover {
      background: #323232;
  }

  /* Estilização do endereço da carteira */
  .wallet-address {
      text-align: center;
      padding: 10px;
      background: #323232;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 14px;
      color: white;
  }

  /* Efeito de fade-in */
  .fade-enter {
      opacity: 0;
      transform: translateY(-10px);
  }

  .fade-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }
</style>

<!-- Botão "Connect" fixo no topo direito -->
<button class="connect-btn" on:click={togglePanel}>
  {isConnectedLeapWallet ? "Wallet Connected" : "Connect"}
</button>

<!-- Menu suspenso abaixo do botão -->
{#if isOpen}
  <div class="menu-container fade-enter fade-enter-active">
      <div class="menu-header">
          Connect a Wallet
          <button class="close-btn" on:click={togglePanel}>✖</button>
      </div>

      {#if isConnectedLeapWallet}
          <div class="wallet-address">🔗 {walletAddress}</div>
          <div class="wallet-option" on:click={disconnectLeapWallet}>🔴 Disconnect LeapWallet</div>
      {:else}
          <div class="wallet-option" on:click={connectLeapWallet}>🔗 Connect LeapWallet</div>
      {/if}
  </div>
{/if}