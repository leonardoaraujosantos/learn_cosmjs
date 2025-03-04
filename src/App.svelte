<script lang="ts">
  import niceBackground from './assets/nice_background.svg'
  import CosmJsConnection from './lib/Blockchain.svelte';
  import SimpleContract from './lib/SimpleContract.svelte';
  import UploadIpfs from './lib/UploadIPFS.svelte';
  import WasmCompiler from './lib/WasmCompiler.svelte';
  import CustomModuleMessage from './lib/CustomModuleMessage.svelte';
  import CustomModuleQuery from './lib/CustomModuleQuery.svelte';
  import BlockchainEvents from './lib/BlockchainEvents.svelte';
  import RegisterComputeTask from './lib/RegisterComputeTask.svelte';
  import ScheduleJob from './lib/ScheduleJob.svelte';
  import JobTaskList from './lib/JobTaskList.svelte';
  import ComputeRegistryList from './lib/ComputeRegistryList.svelte';
</script>

<main>
  <h1>ComputeEngine++</h1>

  <div class="card">
    <BlockchainEvents/>
    <CosmJsConnection/>
    <RegisterComputeTask/>
    <ComputeRegistryList/>
    <ScheduleJob/>
    <JobTaskList/>
    <CustomModuleMessage />
    <CustomModuleQuery/>
    <SimpleContract/>
    <WasmCompiler/>
    <UploadIpfs/>
  </div>

  <p>
    Simple Dapp with <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte</a>, and <a href="https://tutorials.cosmos.network/tutorials/7-cosmjs/1-cosmjs-intro.html" target="_blank" rel="noreferrer">CosmJs</a>!
  </p>

</main>

<style>
  :global(body) {
    margin: 0;
    background-image: url(./assets/nice_background.svg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
  }
</style>