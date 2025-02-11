<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from "svelte/store";
    import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
    import { walletAddress, signingClient, rpcAddress } from "../stores/blockchainStore";

    const contractAddress = "cosmos14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s4hmalr";
    let count: string = "Loading...";
    let message: string = "No message yet.";
    let jobId: string = "0"
    let resultsJson: string = "0"
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
        const signedClient = get(signingClient); // Obtém o cliente do store
        const senderWallet = get(walletAddress); // Obtém o endereço da carteira

        console.log('Client: ', signedClient)
        console.log('Sender: ', senderWallet)
        if (!signedClient || !senderWallet) {
            count = "Connect to LeapWallet first.";
            return;
        }

        const execMsg = { increment: {} };
        const fee = {
            amount: [{ denom: "stake", amount: "5000" }],
            gas: "200000",
        };

        try {
            const result = await signedClient.execute(
                senderWallet, contractAddress, 
                execMsg, fee);
            count = `Incremented! TxHash: ${result.transactionHash}`;
        } catch (error) {
            console.error("Error incrementing:", error);
            count = "Error incrementing.";
        }
    }

    async function pushResult() {
        const signedClient = get(signingClient); // Obtém o cliente do store
        const senderWallet = get(walletAddress); // Obtém o endereço da carteira

        console.log('Client: ', signedClient)
        console.log('Sender: ', senderWallet)
        if (!signedClient || !senderWallet) {
            count = "Connect to LeapWallet first.";
            return;
        }

        const jobIdNumber = parseInt(jobId, 10);
        if (isNaN(jobIdNumber) || jobIdNumber < 0) {
            count = "Invalid Job ID. Must be a non-negative integer.";
            return;
        }

        const execMsg = { push_oracle_result: {job_id: jobIdNumber, results_json: resultsJson} };
        const fee = {
            amount: [{ denom: "stake", amount: "5000" }],
            gas: "200000",
        };

        try {
            const result = await signedClient.execute(
                senderWallet, contractAddress, 
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

/* Organização dos botões */
.contract-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.contract-button {
    padding: 10px;
    background: #a855f7;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    flex: 1;
    min-width: 100px;
}

/* Campo de entrada */
.contract-input {
    margin-top: 10px;
    padding: 8px;
    border: none;
    border-radius: 5px;
    width: 80%;
    text-align: center;
    font-size: 16px;
}

/* Área de texto */
.contract-textarea {
    margin-top: 10px;
    padding: 8px;
    border: none;
    border-radius: 5px;
    width: 80%;
    height: 80px;
    font-size: 14px;
    text-align: left;
    resize: vertical;
}

/* Seção do Push Result */
.push-result-section {
    margin-top: 20px;
    padding: 10px;
    background: #27272a;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #a855f7;
    box-shadow: 0px 4px 10px rgba(168, 85, 247, 0.2);
}

.push-button {
    margin-top: 10px;
    width: 100%;
}

/* Caixa de saída aprimorada */
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

    <!-- Entrada para nome -->
    <input class="contract-input" type="text" bind:value={nameInput} placeholder="Enter name" />

    <!-- Grupo de botões -->
    <div class="contract-buttons">
        <button class="contract-button" on:click={queryCount}>Get Count</button>
        <button class="contract-button" on:click={queryMessage}>Get Message</button>
        <button class="contract-button" on:click={incrementCount}>Increment</button>
    </div>

    <!-- Seção para Push Result -->
    <div class="push-result-section">
        <h3>Push Oracle Result</h3>
        
        <input class="contract-input" type="text" bind:value={jobId} placeholder="Enter Job ID" />
        <textarea class="contract-textarea" bind:value={resultsJson} placeholder="Enter Result JSON"></textarea>
        
        <button class="contract-button push-button" on:click={pushResult}>Push Result</button>
    </div>

    <!-- Caixa de saída aprimorada -->
    <div class="contract-output">
        <p>{count}</p>
        <p>{message}</p>
    </div>
</div>