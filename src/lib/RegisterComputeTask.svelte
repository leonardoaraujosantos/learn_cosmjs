<script lang="ts">
    import { get } from "svelte/store";
    import { SigningStargateClient } from "@cosmjs/stargate";
    import { Registry } from "@cosmjs/proto-signing";
    import { MsgRegisterComputeTask } from "../types/generated/aminichain/apigateway/tx";
    import { walletAddress, rpcAddress, offlineSigner } from "../stores/blockchainStore";
  
    const registry = new Registry();
    registry.register("/aminichain.apigateway.MsgRegisterComputeTask", MsgRegisterComputeTask);
  
    let description = "";
    let uri = "";
    let inputShape = "";
    let outputShape = "";
    let computeType = 0;
    let inputSample = "";
    let statusMessage: string = "";
    let loading: boolean = false;
    let success: boolean = false;
  
    async function registerComputeTask() {
      loading = true;
      statusMessage = "Sending transaction...";
      success = false;
      
      try {
        const blockchainAddr = get(rpcAddress)
        const walletOfflineSigner = get(offlineSigner)
        const msgWalletAddr = get(walletAddress)
        if (!blockchainAddr || !walletOfflineSigner || !msgWalletAddr) {
            statusMessage = "Connect to LeapWallet first.";
            loading = false;
            return;
        }

        // Get a client signing interface
        const client = await SigningStargateClient.connectWithSigner(
            blockchainAddr, 
            walletOfflineSigner, 
            { registry }
        );
  
        const msg = {
          creator: get(walletAddress),
          description,
          uri,
          inputShape,
          outputShape,
          computeType,
          inputSample,
        };
  
        const fee = {
          amount: [{ denom: "stake", amount: "5000" }],
          gas: "200000",
        };
  
        const result = await client.signAndBroadcast(msgWalletAddr, [{
          typeUrl: "/aminichain.apigateway.MsgRegisterComputeTask",
          value: msg,
        }], fee, "Register Compute Task");
  
        if (result.code !== undefined && result.code !== 0) {
          statusMessage = `Transaction failed: ${result.rawLog}`;
          success = false;
        } else {
          statusMessage = `Task registered! TxHash: ${result.transactionHash}`;
          success = true;
        }
      } catch (error) {
        console.error("Error broadcasting transaction:", error);
        statusMessage = `Error broadcasting transaction: ${error}`;
        success = false;
      }
      
      loading = false;
    }
  </script>
  
  <style>
    /* Mantendo o mesmo estilo do OraclePushResult */
    .container {
      padding: 2rem;
      background: #1e1b2e;
      color: white;
      border-radius: 12px;
      max-width: 500px;
      margin: 2rem auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
  
    h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: white;
    }
  
    .form-group {
      margin-bottom: 1rem;
    }
  
    label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #a1a1aa;
    }
  
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      background: #2d2b3b;
      border: 1px solid #4c4b63;
      border-radius: 6px;
      color: white;
    }
  
    button {
      width: 100%;
      padding: 0.75rem;
      background: #7c3aed;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
    }
  
    button:hover:not(:disabled) {
      background: #6d28d9;
    }
  
    button:disabled {
      background: #4c4b63;
      cursor: not-allowed;
    }
  
    .status {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
    }
  
    .status.success {
      color: #86efac;
    }
  
    .status.error {
      color: #fca5a5;
    }
  </style>
  
  <div class="container">
    <h2>Register Compute Task</h2>
  
    <div class="form-group">
      <label for="description">Description</label>
      <input id="description" type="text" bind:value={description} placeholder="Task description" />
    </div>
  
    <div class="form-group">
      <label for="uri">URI</label>
      <input id="uri" type="text" bind:value={uri} placeholder="Resource URI" />
    </div>
  
    <div class="form-group">
      <label for="inputShape">Input Shape</label>
      <input id="inputShape" type="text" bind:value={inputShape} placeholder="Shape of input" />
    </div>
  
    <div class="form-group">
      <label for="outputShape">Output Shape</label>
      <input id="outputShape" type="text" bind:value={outputShape} placeholder="Shape of output" />
    </div>
  
    <div class="form-group">
      <label for="computeType">Compute Type</label>
      <input id="computeType" type="number" bind:value={computeType} placeholder="Type of compute task" />
    </div>
  
    <div class="form-group">
      <label for="inputSample">Input Sample</label>
      <textarea id="inputSample" bind:value={inputSample} placeholder="Sample input data"></textarea>
    </div>
  
    <button on:click={registerComputeTask} disabled={loading}>
      {loading ? "Sending..." : "Register Task"}
    </button>
  
    {#if statusMessage}
      <div class="status {success ? 'success' : 'error'}">{statusMessage}</div>
    {/if}
  </div>