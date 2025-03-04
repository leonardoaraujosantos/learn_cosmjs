<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { walletAddress, restAddress } from "../stores/blockchainStore";
  
    type JobTask = {
      id: string;
      webHookUrl: string;
      InputJson: string;
      done: boolean;
      startBlockHeight: string;
      finishedBlockHeight: string;
      computeTaskId: string;
      Creator: string;
      Result: string;
      Executor: string;
    };
  
    type JobTaskResponse = {
      jobTask: JobTask[];
      pagination: {
        next_key: null | string;
        total: string;
      };
    };
  
    let jobTasks: JobTask[] = [];
    let loading: boolean = false;
    let error: string | null = null;
    
    async function fetchJobTasks() {
      loading = true;
      error = null;
      const creatorAddress = get(walletAddress)
      const restEndpoint = get(restAddress)
      
      try {
        const response = await fetch(
          `${restEndpoint}/aminichain/apigateway/job_task_list?creator=${creatorAddress}&done=false`,
          {
            headers: {
              "accept": "application/json"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: JobTaskResponse = await response.json();
        jobTasks = data.jobTask;
      } catch (err) {
        console.error("Error fetching job tasks:", err);
        error = err instanceof Error ? err.message : "Unknown error occurred";
      } finally {
        loading = false;
      }
    }
    
    // Load data on component mount
    onMount(fetchJobTasks);
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
  
    .badge.pending {
      background: #374151;
      color: #d1d5db;
    }
  
    .badge.completed {
      background: #065f46;
      color: #a7f3d0;
    }
  </style>
  
  <div class="container">
    <div class="header">
      <h2>Job Tasks</h2>
      
      <button class="refresh-btn" on:click={fetchJobTasks} disabled={loading}>
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
      {#if jobTasks.length > 0}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Compute Task ID</th>
              <th>Webhook URL</th>
              <th>Input JSON</th>
              <th>Start Height</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each jobTasks as task}
              <tr>
                <td>{task.id}</td>
                <td>{task.computeTaskId}</td>
                <td>
                  <div class="truncate" title={task.webHookUrl}>
                    {task.webHookUrl}
                  </div>
                </td>
                <td>
                  <div class="truncate" title={task.InputJson}>
                    {task.InputJson}
                  </div>
                </td>
                <td>{task.startBlockHeight}</td>
                <td>
                  <span class="badge {task.done ? 'completed' : 'pending'}">
                    {task.done ? 'Completed' : 'Pending'}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else if loading}
        <div class="empty-state">Loading job tasks...</div>
      {:else}
        <div class="empty-state">No job tasks found.</div>
      {/if}
    </div>
  </div>