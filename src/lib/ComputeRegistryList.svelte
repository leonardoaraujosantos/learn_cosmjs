<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { restAddress } from "../stores/blockchainStore";
  
    type ComputeTask = {
      id: string;
      desc: string;
      url: string;
      inputShape: string;
      outputShape: string;
      inputSample: string;
      computeType: string;
      Creator: string;
    };
  
    type ComputeTaskResponse = {
      ComputeTask: ComputeTask[];
      pagination: {
        next_key: null | string;
        total: string;
      };
    };
  
    let computeTasks: ComputeTask[] = [];
    let loading: boolean = false;
    let error: string | null = null;
    
    // Function to get human-readable compute type
    function getComputeTypeLabel(type: string): string {
      switch (type) {
        case "0":
          return "Machine Learning";
        case "1":
          return "Web Assembly";
        default:
          return `Unknown (${type})`;
      }
    }
    
    async function fetchComputeTasks() {
      loading = true;
      error = null;
      const restEndpoint = get(restAddress) || "http://127.0.0.1:1317";
      
      try {
        const response = await fetch(
          `${restEndpoint}/aminichain/apigateway/compute_task_list`,
          {
            headers: {
              "accept": "application/json"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: ComputeTaskResponse = await response.json();
        computeTasks = data.ComputeTask;
      } catch (err) {
        console.error("Error fetching compute tasks:", err);
        error = err instanceof Error ? err.message : "Unknown error occurred";
      } finally {
        loading = false;
      }
    }
    
    // Load data on component mount
    onMount(fetchComputeTasks);
  </script>
  
  <style>
    .container {
      padding: 2rem;
      background: #1e1b2e;
      color: white;
      border-radius: 12px;
      max-width: 1000px;
      margin: 2rem auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
  
    h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: white;
    }
  
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
  
    .table-container {
      overflow-x: auto;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
  
    th, td {
      padding: 0.75rem;
      border-bottom: 1px solid #4c4b63;
    }
  
    th {
      background: #2d2b3b;
      color: #a1a1aa;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  
    tr:hover {
      background: #2d2b3b;
    }
  
    .refresh-btn {
      padding: 0.75rem 1.25rem;
      background: #2d2b3b;
      color: white;
      border: 1px solid #4c4b63;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .refresh-btn:hover:not(:disabled) {
      background: #3d3b4b;
      transform: translateY(-1px);
      border-color: #7c3aed;
    }
  
    .refresh-btn:disabled {
      background: #2d2b3b;
      color: #6b7280;
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
  
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #a1a1aa;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    .truncate {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
  
    .badge.ml {
      background: #4f46e5;
      color: #e0e7ff;
    }
  
    .badge.wasm {
      background: #b45309;
      color: #fef3c7;
    }
    
    .badge.unknown {
      background: #4b5563;
      color: #e5e7eb;
    }
  </style>
  
  <div class="container">
    <div class="header">
      <h2>Compute Tasks</h2>
      
      <button class="refresh-btn" on:click={fetchComputeTasks} disabled={loading}>
        {#if loading}
          <div class="spinner"></div>
          <span>Loading...</span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
          </svg>
          <span>Refresh</span>
        {/if}
      </button>
    </div>
    
    {#if error}
      <div class="status error">{error}</div>
    {/if}
    
    <div class="table-container">
      {#if computeTasks.length > 0}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>URL</th>
              <th>Input Shape</th>
              <th>Output Shape</th>
              <th>Input Sample</th>
              <th>Type</th>
              <th>Creator</th>
            </tr>
          </thead>
          <tbody>
            {#each computeTasks as task}
              <tr>
                <td>{task.id}</td>
                <td>
                  <div class="truncate" title={task.desc}>
                    {task.desc}
                  </div>
                </td>
                <td>
                  <div class="truncate" title={task.url}>
                    {task.url}
                  </div>
                </td>
                <td>
                  <div class="truncate" title={task.inputShape}>
                    {task.inputShape}
                  </div>
                </td>
                <td>
                  <div class="truncate" title={task.outputShape}>
                    {task.outputShape}
                  </div>
                </td>
                <td>
                  <div class="truncate" title={task.inputSample}>
                    {task.inputSample}
                  </div>
                </td>
                <td>
                  {#if task.computeType === "0"}
                    <span class="badge ml">🤖🧠</span>
                  {:else if task.computeType === "1"}
                    <span class="badge wasm">Wasm</span>
                  {:else}
                    <span class="badge unknown">{getComputeTypeLabel(task.computeType)}</span>
                  {/if}
                </td>
                <td>
                  <div class="truncate" title={task.Creator}>
                    {task.Creator}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else if loading}
        <div class="empty-state">Loading compute tasks...</div>
      {:else}
        <div class="empty-state">No compute tasks found.</div>
      {/if}
    </div>
  </div>