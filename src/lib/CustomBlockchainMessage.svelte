<script lang="ts">
    import { get } from "svelte/store";
    import { OfflineSigner, SigningStargateClient } from "@cosmjs/stargate";
    import { Registry } from "@cosmjs/proto-signing";
    // Adjust the path based on where your generated files are located.
    import { MsgOraclePushResult } from "../types/aminichain/apigateway/tx";
    import { walletAddress, signingClient, rpcAddress, offlineSigner } from "../stores/blockchainStore";
  
    // --- Register your custom message ---
    const registry = new Registry();
    registry.register("/aminichain.apigateway.MsgOraclePushResult", MsgOraclePushResult);
  
    // Component state
    let jobId: number = 0;
    let resultsJson: string = '{"result": "success"}';
    let statusMessage: string = "";
    let loading: boolean = false;
  
    // Function to send the OraclePushResult transaction
    async function sendOraclePushResult() {
      loading = true;
      statusMessage = "Sending transaction...";
      try {
        const client = await SigningStargateClient.connectWithSigner(
          get(rpcAddress), get(offlineSigner), 
          { registry });
        
        // Prepare your message using the user-supplied parameters.
        const msg = {
          creator: get(walletAddress),
          jobId: jobId,
          resultsJson: resultsJson,
        };
  
        // Define transaction fee details
        const fee = {
          amount: [{ denom: "stake", amount: "5000" }],
          gas: "200000",
        };
  
        // Sign and broadcast the transaction
        const result = await client.signAndBroadcast(get(walletAddress), [
          {
            typeUrl: "/aminichain.apigateway.MsgOraclePushResult",
            value: msg,
          },
        ], fee, "Push Oracle Result");
  
        if (result.code !== undefined && result.code !== 0) {
          statusMessage = `Transaction failed: ${result.log || result.rawLog}`;
        } else {
          statusMessage = `Transaction sent successfully. TxHash: ${result.transactionHash}`;
        }
      } catch (error) {
        console.error("Error broadcasting transaction:", error);
        statusMessage = `Error broadcasting transaction: ${error}`;
      }
      loading = false;
    }
  </script>
  
  <style>
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    input,
    textarea,
    button {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    button {
      cursor: pointer;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
    }
    button:disabled {
      background: #ccc;
    }
    .status {
      margin-top: 1rem;
      font-style: italic;
    }
  </style>
  
  <div class="container">
    <h2>Oracle Push Result</h2>
    <div>
      <label for="jobId">Job ID:</label>
      <input
        id="jobId"
        type="number"
        bind:value={jobId}
        min="0"
        placeholder="Enter Job ID"
      />
    </div>
    <div>
      <label for="resultsJson">Results JSON:</label>
      <textarea
        id="resultsJson"
        rows="4"
        bind:value={resultsJson}
        placeholder='e.g., &#123;"result": "success"&#125;'
      ></textarea>
    </div>
    <button on:click={sendOraclePushResult} disabled={loading}>
      {loading ? "Sending..." : "Send Oracle Push Result"}
    </button>
    {#if statusMessage}
      <div class="status">{statusMessage}</div>
    {/if}
  </div>