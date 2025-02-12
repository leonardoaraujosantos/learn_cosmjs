<script lang="ts">
  import { get } from "svelte/store";
  import { OfflineSigner, SigningStargateClient } from "@cosmjs/stargate";
  import { Registry } from "@cosmjs/proto-signing";
  import { MsgOraclePushResult } from "../types/aminichain/apigateway/tx";
  import { walletAddress, signingClient, rpcAddress, offlineSigner } from "../stores/blockchainStore";
  import { fade, fly } from 'svelte/transition';

  const registry = new Registry();
  registry.register("/aminichain.apigateway.MsgOraclePushResult", MsgOraclePushResult);

  let jobId: number = 0;
  let resultsJson: string = '{"result": "success"}';
  let statusMessage: string = "";
  let loading: boolean = false;
  let success: boolean = false;

  async function sendOraclePushResult() {
    loading = true;
    statusMessage = "Sending transaction...";
    success = false;
    
    try {
      if (!get(rpcAddress) || !get(offlineSigner)) {
          statusMessage = "Connect to LeapWallet first.";
          loading = false;
          return;
      }

      const client = await SigningStargateClient.connectWithSigner(
        get(rpcAddress), 
        get(offlineSigner), 
        { registry }
      );
      
      const msg = {
        creator: get(walletAddress),
        jobId: jobId,
        resultsJson: resultsJson,
      };

      const fee = {
        amount: [{ denom: "stake", amount: "5000" }],
        gas: "200000",
      };

      const result = await client.signAndBroadcast(
        get(walletAddress), 
        [{
          typeUrl: "/aminichain.apigateway.MsgOraclePushResult",
          value: msg,
        }], 
        fee, 
        "Push Oracle Result"
      );

      if (result.code !== undefined && result.code !== 0) {
        statusMessage = `Transaction failed: ${result.log || result.rawLog}`;
        success = false;
      } else {
        statusMessage = `Transaction sent successfully. TxHash: ${result.transactionHash}`;
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
    margin: 0 0 1.5rem;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: #a1a1aa;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
    transition: all 0.2s;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  button:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-1px);
  }

  button:disabled {
    background: #4c4b63;
    cursor: not-allowed;
    transform: none;
  }

  .status {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .status.error {
    background: #2d2b3b;
    color: #fca5a5;
    border: 1px solid #ef4444;
  }

  .status.success {
    background: #2d2b3b;
    color: #86efac;
    border: 1px solid #22c55e;
  }

  .status.info {
    background: #2d2b3b;
    color: #93c5fd;
    border: 1px solid #3b82f6;
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

<div class="container" in:fly="{{ y: 20, duration: 400 }}">
  <h2>Oracle Push Result</h2>
  
  <div class="form-group">
    <label for="jobId">Job ID</label>
    <input
      id="jobId"
      type="number"
      bind:value={jobId}
      min="0"
      placeholder="Enter Job ID"
    />
  </div>
  
  <div class="form-group">
    <label for="resultsJson">Results JSON</label>
    <textarea
      id="resultsJson"
      bind:value={resultsJson}
      placeholder="Enter Result JSON"
    ></textarea>
  </div>

  <button on:click={sendOraclePushResult} disabled={loading}>
    {#if loading}
      <div class="spinner"></div>
      <span>Processing...</span>
    {:else}
      <span>Send Oracle Push Result</span>
    {/if}
  </button>

  {#if statusMessage}
    <div 
      class="status {success ? 'success' : loading ? 'info' : 'error'}"
      in:fade="{{ duration: 200 }}"
    >
      {statusMessage}
    </div>
  {/if}
</div>