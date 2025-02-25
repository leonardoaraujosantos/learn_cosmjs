<script lang="ts">
    import { get } from "svelte/store";
    import { SigningStargateClient } from "@cosmjs/stargate";
    import { Registry } from "@cosmjs/proto-signing";
    import { MsgScheduleJob } from "../types/generated/aminichain/apigateway/tx";
    import { walletAddress, rpcAddress, offlineSigner } from "../stores/blockchainStore";
  
    const registry = new Registry();
    registry.register("/aminichain.apigateway.MsgScheduleJob", MsgScheduleJob);
  
    let computeTaskId = 0;
    let webhookUrl = "";
    let inputJson = "";
    let statusMessage: string = "";
    let loading: boolean = false;
    let success: boolean = false;
  
    async function scheduleJob() {
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
          computeTaskId,
          webhookUrl,
          inputJson,
        };
  
        const fee = {
          amount: [{ denom: "stake", amount: "5000" }],
          gas: "200000",
        };
  
        const result = await client.signAndBroadcast(msgWalletAddr, [{
          typeUrl: "/aminichain.apigateway.MsgScheduleJob",
          value: msg,
        }], fee, "Schedule Job");
  
        if (result.code !== undefined && result.code !== 0) {
          statusMessage = `Transaction failed: ${result.rawLog}`;
          success = false;
        } else {
          statusMessage = `Job scheduled! TxHash: ${result.transactionHash}`;
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
      margin-bottom: 1.5rem;
    }
  
    label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #a1a1aa;
      text-transform: uppercase;
    }
  
    input,
    textarea {
      width: 100%;
      padding: 0.75rem;
      background: #2d2b3b;
      border: 1px solid #4c4b63;
      border-radius: 6px;
      color: white;
      font-size: 0.875rem;
    }
  
    input::placeholder,
    textarea::placeholder {
      color: #6b7280;
    }
  
    input:focus,
    textarea:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }
  
    textarea {
      min-height: 100px;
      resize: vertical;
    }
  
    button {
      width: 100%;
      padding: 0.75rem;
      background: #7c3aed;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
  
    button:hover:not(:disabled) {
      background: #6d28d9;
      transform: translateY(-1px);
    }
  
    button:disabled {
      background: #4c4b63;
      cursor: not-allowed;
    }
  
    .status {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      line-height: 1.5;
      text-align: center;
    }
  
    .status.success {
      background: #2d2b3b;
      color: #86efac;
      border: 1px solid #22c55e;
    }
  
    .status.error {
      background: #2d2b3b;
      color: #fca5a5;
      border: 1px solid #ef4444;
    }
  
    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid #ffffff;
      border-top: 3px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  
  <div class="container">
    <h2>Schedule Job</h2>
  
    <div class="form-group">
      <label for="computeTaskId">Compute Task ID</label>
      <input
        id="computeTaskId"
        type="number"
        bind:value={computeTaskId}
        min="0"
        placeholder="Enter Compute Task ID"
      />
    </div>
  
    <div class="form-group">
      <label for="webhookUrl">Webhook URL</label>
      <input
        id="webhookUrl"
        type="text"
        bind:value={webhookUrl}
        placeholder="Enter Webhook URL"
      />
    </div>
  
    <div class="form-group">
      <label for="inputJson">Input JSON</label>
      <textarea
        id="inputJson"
        bind:value={inputJson}
        placeholder='e.g., &#123;"input": [1,2,3]&#125;'
      ></textarea>
    </div>
  
    <button on:click={scheduleJob} disabled={loading}>
      {#if loading}
        <div class="spinner"></div>
        <span>Processing...</span>
      {:else}
        <span>Schedule Job</span>
      {/if}
    </button>
  
    {#if statusMessage}
      <div class="status {success ? 'success' : 'error'}">{statusMessage}</div>
    {/if}
  </div>