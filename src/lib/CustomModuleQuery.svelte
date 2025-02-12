<script lang="ts">
    import { get } from "svelte/store";
    import { restAddress } from "../stores/blockchainStore";

    let jobId: number = 0;
    let queryResult: string = "Waiting for query...";
    let loading: boolean = false;

    async function fetchCustomQuery() {
        loading = true;
        try {
            const blockchainRestAddr = get(restAddress);
            if (!blockchainRestAddr) {
                queryResult = "REST Address not available.";
                return;
            }

            // URL do endpoint para seu módulo customizado
            const queryUrl = `${blockchainRestAddr}/aminichain/apigateway/job_status/${jobId}`;

            console.log("Fetching from:", queryUrl);
            const response = await fetch(queryUrl);
            if (!response.ok) {
                throw new Error(`Query failed: ${response.statusText}`);
            }

            const result = await response.json();
            queryResult = JSON.stringify(result, null, 4); // Formatação JSON bonita
        } catch (error) {
            console.error("Error fetching query:", error);
            queryResult = `Error fetching query: ${error}`;
        }
        loading = false;
    }
</script>

<style>
  .query-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #1e1b2e;
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  h2 {
    margin-bottom: 1.5rem;
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

  input {
    width: 100%;
    padding: 0.75rem;
    background: #2d2b3b;
    border: 1px solid #4c4b63;
    border-radius: 6px;
    color: white;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  input::placeholder {
    color: #6b7280;
  }

  input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
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

  .query-result {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #27272a;
    color: #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;  /* Mantém a formatação JSON */
    word-wrap: break-word;
    overflow-x: auto; /* Adiciona rolagem horizontal se necessário */
    border: 1px solid #a855f7;
    box-shadow: 0px 4px 10px rgba(168, 85, 247, 0.2);
    max-height: 400px; /* Limita a altura para evitar overflow */
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

<div class="query-container">
  <h2>Custom Query</h2>

  <div class="form-group">
    <label for="jobId">JOB ID:</label>
    <input
      id="jobId"
      type="number"
      bind:value={jobId}
      min="0"
      placeholder="Enter Job ID"
    />
  </div>

  <button on:click={fetchCustomQuery} disabled={loading}>
    {#if loading}
      <div class="spinner"></div>
      <span>Fetching...</span>
    {:else}
      <span>Fetch Query</span>
    {/if}
  </button>

  <div class="query-result">
    <pre>{queryResult}</pre>
  </div>
</div>