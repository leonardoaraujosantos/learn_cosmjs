# CosmJS + Svelte

## Overview
`learn_cosmjs` is a demonstration project showcasing how to build a decentralized application (dApp) that interfaces with a Cosmos SDK blockchain. The project is built with Svelte for the frontend UI and uses CosmJS for blockchain communication.

## Architecture

### Frontend Components
The application is structured as a single-page Svelte application with multiple components that demonstrate different interactions with the blockchain:

1. **Wallet Connections**:
   - `LeapWalletConnect.svelte` - Connects to the LeapWallet browser extension
   - `Web3AuthConnect.svelte` - Alternative authentication via Web3Auth

2. **Blockchain Interactions**:
   - `CustomModuleMessage.svelte` - Demonstrates sending custom messages to blockchain modules
   - `CustomModuleQuery.svelte` - Shows how to query custom module data
   - `BlockchainEvents.svelte` - Listens for blockchain events

3. **Compute Engine Components**:
   - `RegisterComputeTask.svelte` - Registers computation tasks on the blockchain
   - `ComputeRegistryList.svelte` - Lists registered compute tasks
   - `ScheduleJob.svelte` - Schedules computation jobs
   - `JobTaskList.svelte` - Shows list of scheduled jobs

4. **Additional Features**:
   - `SimpleContract.svelte` - Demonstrates smart contract interactions
   - `WasmCompiler.svelte` - Shows WASM compilation
   - `UploadIpfs.svelte` - Demonstrates IPFS integration

### State Management
The application uses Svelte's store pattern for state management through `BlockchainStore.ts`, which maintains:

- Connection state (wallet addresses, connection status)
- Client instances (StargateClient, SigningClient)
- Network configuration (RPC addresses, chain ID)

### Blockchain Communication

#### Message Sending
The application communicates with the Cosmos SDK blockchain using several key mechanisms:

1. **CosmJS Stargate Client**:
   - Used for read-only operations like querying balances
   - Connected via `StargateClient.connect(rpcAddress)`

2. **Signing Clients**:
   - `SigningStargateClient` - Used for sending transactions with custom messages
   - `SigningCosmWasmClient` - Used for CosmWasm smart contract interactions
   - Both require an `OfflineSigner` from a wallet

3. **Custom Module Integration**:
   - Uses Protobuf-generated TypeScript definitions (e.g., `MsgOraclePushResult`)
   - Registers custom message types with the Registry
   - Constructs module-specific messages with appropriate fields

4. **Transaction Flow**:
   - Creates message object with required fields
   - Sets up transaction fee configuration
   - Uses `signAndBroadcast` to send the transaction
   - Handles success/error responses

#### Query Operations
For reading blockchain state, the application:

1. Connects to the REST API endpoints
2. Constructs module-specific query URLs
3. Uses fetch API to retrieve JSON data
4. Parses and displays results

## Core Technologies

1. **CosmJS**:
   - `@cosmjs/stargate` - Main interface to Cosmos SDK
   - `@cosmjs/proto-signing` - Handles transaction signing
   - `@cosmjs/cosmwasm-stargate` - For CosmWasm contract interactions

2. **Protobuf Integration**:
   - Uses generated TypeScript interfaces from Protobuf definitions
   - Implements proper serialization/deserialization of messages

3. **Wallet Integration**:
   - LeapWallet support via browser extension
   - Web3Auth for alternative authentication

4. **Frontend Framework**:
   - Svelte for reactive UI components
   - TypeScript for type safety

## Custom Blockchain Module ("apigateway")
The project interacts with a custom Cosmos SDK module named "apigateway" which provides:

1. **Compute Task Registration**:
   - Register computation tasks with details like URI, input/output shapes
   - Retrieve registered compute tasks

2. **Job Scheduling**:
   - Schedule jobs against registered compute tasks
   - Provide input data and webhook URLs for callbacks

3. **Oracle Result Pushing**:
   - Send computation results back to the blockchain
   - Update job status with result JSON

This creates a decentralized compute orchestration system where tasks can be registered, jobs scheduled, and results recorded on-chain.

## Running

```bash
npm run dev
```

## References
* https://gist.github.com/webmaster128/8444d42a7eceeda2544c8a59fbd7e1d9
* https://github.com/cosmos/cosmjs/blob/main/packages/stargate/CUSTOM_PROTOBUF_CODECS.md
* https://tutorials.cosmos.network/tutorials/7-cosmjs/
* https://github.com/cosmos/cosmjs/wiki/What-can-CosmJS-do-for-me%3F
* https://www.youtube.com/watch?v=4gFSuLUlP4I
* https://www.youtube.com/watch?v=RlqjEVIv1Pg&list=TLGGK5gRW-brbY4xMTAyMjAyNQ
* https://www.youtube.com/watch?v=z1HDh2KdiGI
* https://www.youtube.com/watch?v=YUsjneQptDQ
* https://protobuf.dev
* https://github.com/stephenh/ts-proto
* https://ida.interchain.io/hands-on-exercise/3-cosmjs-adv/2-cosmjs-messages.html
* https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html
* https://www.mechanicalrock.io/blog/getting-started-with-protobufs-and-typescript
