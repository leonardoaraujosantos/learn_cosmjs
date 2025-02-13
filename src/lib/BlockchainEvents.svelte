<script lang="ts">
    import { onMount } from 'svelte';
    import { Tendermint37Client } from "@cosmjs/tendermint-rpc";

    let blockHeight: string = "Waiting for new blocks...";
    let transactionEvent: string = "Waiting for transactions...";
    let tmClient: Tendermint37Client;

    const rpcWebSocketEndpoint = "ws://127.0.0.1:26657";

    async function connectWebSocket() {
        try {
            tmClient = await Tendermint37Client.connect(rpcWebSocketEndpoint);
            console.log("Connected to WebSocket RPC");

            const blockStream = tmClient.subscribeNewBlock();
            blockStream.addListener({
                next: (block) => {
                    console.log("Novo bloco recebido:", block);
                    blockHeight = `Latest Block Height: ${block.lastCommit?.height}`;
                },
                error: (err) => {
                    console.error("Error in block stream:", err);
                    blockHeight = "Error receiving block events.";
                },
                complete: () => console.log("Stream completed")
            });

            const txStream = tmClient.subscribeTx("tm.event = 'Tx'");
            txStream.addListener({
                next: (tx) => {
                    console.log("Nova transação recebida:", tx);
                    transactionEvent = `Transaction Hash: ${tx.result.log}`;
                },
                error: (err) => {
                    console.error("Error in transaction stream:", err);
                    transactionEvent = "Error receiving transaction events.";
                },
                complete: () => console.log("Transaction stream completed")
            });

        } catch (error) {
            console.error("Error connecting to WebSocket RPC:", error);
            blockHeight = "Error connecting to WebSocket RPC.";
            transactionEvent = "Error connecting to WebSocket RPC.";
        }
    }

    onMount(connectWebSocket);
</script>

<style>
  .block-container {
    padding: 20px;
    background: #1e293b;
    color: white;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    margin: auto;
    font-family: Arial, sans-serif;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
</style>

<div class="block-container">
    <h2>Blockchain Status</h2>
    <p>{blockHeight}</p>
    <h2>Transaction Events</h2>
    <p>{transactionEvent}</p>
</div>
