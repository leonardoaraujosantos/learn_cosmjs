<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from "svelte/store";
    import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
    import { walletAddress, signingClient, rpcAddress } from "../stores/blockchainStore";

    const contractAddress = "cosmos14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s4hmalr";
    let count: string = "Loading...";
    let message: string = "No message yet.";
    let nameInput: string = "leo!"; // Valor inicial do input
    let cosmWasmClient: any;

    onMount(async () => {
        try {
            cosmWasmClient = await CosmWasmClient.connect(get(rpcAddress));
        } catch (error) {
            console.error("Error connecting to CosmWasmClient:", error);
        }
    });
    
    async function queryCount() {
        const queryMsg = { get_count: {} };
        const response = await cosmWasmClient.queryContractSmart(
            contractAddress, queryMsg);
        count = `Counter: ${response.count}`;
    }

    async function queryMessage() {
        const queryMsg = { get_message: { name: nameInput } };
        const response = await cosmWasmClient.queryContractSmart(
            contractAddress, queryMsg);
        console.log("Result query get_message", response);
        message = `Message: ${response.message}`;
    }

    async function incrementCount() {
        const client = get(signingClient); // Obtém o cliente do store
        const sender = get(walletAddress); // Obtém o endereço da carteira

        console.log('Client: ', client)
        console.log('Sender: ', sender)
        if (!client || !sender) {
            count = "Connect to LeapWallet first.";
            return;
        }

        const execMsg = { increment: {} };
        const fee = {
            amount: [{ denom: "stake", amount: "5000" }],
            gas: "200000",
        };

        try {
            const result = await client.execute(
                sender, contractAddress, 
                execMsg, fee);
            count = `Incremented! TxHash: ${result.transactionHash}`;
        } catch (error) {
            console.error("Error incrementing:", error);
            count = "Error incrementing.";
        }
    }
</script>

<style>
  .contract-container {
      padding: 20px;
      background: #1a1a2e;
      color: white;
      border-radius: 10px;
      text-align: center;
      max-width: 400px;
      margin: auto;
  }

  .contract-button {
      margin-top: 10px;
      padding: 10px;
      background: #a855f7;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      color: white;
  }

  .contract-input {
      margin-top: 10px;
      padding: 8px;
      border: none;
      border-radius: 5px;
      width: 80%;
      text-align: center;
      font-size: 16px;
  }

  /* Caixa de saída melhorada */
.contract-output {
    margin-top: 15px;
    background: #27272a;
    padding: 12px;
    border-radius: 5px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    text-align: left;
    font-size: 14px;
    max-width: 100%;
    border: 1px solid #a855f7;
    box-shadow: 0px 4px 10px rgba(168, 85, 247, 0.2);
}
</style>

<div class="contract-container">
    <h2>Simple Contract</h2>

    <!-- Caixa de texto para entrada do nome -->
    <input class="contract-input" type="text" bind:value={nameInput} placeholder="Enter name" />

    <button class="contract-button" on:click={queryCount}>Get Count</button>
    <button class="contract-button" on:click={queryMessage}>Get Message</button>
    <button class="contract-button" on:click={incrementCount}>Increment</button>

    <div class="contract-output">
        <p>{count}</p>
        <p>{message}</p>
    </div>
</div>