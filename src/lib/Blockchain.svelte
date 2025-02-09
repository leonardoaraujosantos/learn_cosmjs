<script lang="ts">
    import { onMount } from 'svelte';
    import { StargateClient } from "@cosmjs/stargate"
    import { fly } from "svelte/transition";
    let isOpen = false;

    function togglePanel() {
      isOpen = !isOpen;
    }
  
    // Variável para armazenar os dados obtidos
    let accountInfo: any = null;
    let allBalances: any = null;
  
    // Substitua pelo endereço desejado ou outra variável de entrada
    const address = 'cosmos1ktktnwcekqytamsasnzck2vgu3vg6jfmnhdd8j';
  
    onMount(async () => {
      // Cria uma instância do CosmosJS  
      try {
            const stargateClient = await StargateClient.connect(
              'http://127.0.0.1:26657'
            );
            console.log("CosmJS Stargate Connected @",await stargateClient.getChainId());
            allBalances = await stargateClient.getAllBalances(address)
            accountInfo = await stargateClient.getAccount(address);
            console.log("All Balances: ",allBalances)
            console.log("Account Info: ",accountInfo)
          } catch (error) {
            console.error('Error connecting to Stargate:', error);
          }
    });
  </script>
  
  <style>
    /* Botão "Connect" no topo direito */
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
      top: 60px; /* Ajusta a posição abaixo do botão */
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
      padding: 12px;
      background: #27272a;
      border-bottom: 1px solid #323232;
      cursor: pointer;
      transition: background 0.2s;
    }
  
    .wallet-option:hover {
      background: #323232;
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
  <button class="connect-btn" on:click={togglePanel}>Connect</button>
  
  <!-- Menu suspenso abaixo do botão -->
  {#if isOpen}
    <div class="menu-container fade-enter fade-enter-active">
      <div class="menu-header">
        Connect a Wallet
        <button class="close-btn" on:click={togglePanel}>✖</button>
      </div>
  
      <div class="wallet-option">🔗 User LeapWallet</div>
      <div class="wallet-option">🔗 Use Keplr Wallet</div>
      <div class="wallet-option">📱 User LeapWallet Mobile</div>
    </div>
  {/if}