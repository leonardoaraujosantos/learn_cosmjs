<script>
    import { onMount } from "svelte";
    import wabtInit from "wabt"; // Installed via npm
  
    // Default WAT code
    let watCode = `(module
    (func $add (param $a i32) (param $b i32) (result i32)
      local.get $a
      local.get $b
      i32.add)
    (export "add" (func $add)))`;
  
    let output = "";
    let wasmModule = null;
    let wasmBytes = null; // We'll store the binary bytes here for download
    let wabtInstance = null;
  
    onMount(async () => {
      try {
        // Initialize WABT (this only runs in the browser)
        wabtInstance = await wabtInit();
      } catch (error) {
        console.error("Failed to initialize WABT:", error);
        output = "Error: Failed to initialize WABT: " + error.message;
      }
    });
  
    async function compileWat() {
      if (!wabtInstance) {
        output = "Error: WABT not initialized";
        return;
      }
  
      try {
        // Parse the WAT code into a WABT module object
        const moduleObj = wabtInstance.parseWat("test.wat", watCode);
        
        // Convert the module to a binary, with logging enabled (optional)
        const binaryResult = moduleObj.toBinary({ log: true });
        
        // Extract the correct ArrayBuffer slice from the returned Uint8Array.
        wasmBytes = binaryResult.buffer.slice(
          binaryResult.buffer.byteOffset,
          binaryResult.buffer.byteOffset + binaryResult.buffer.byteLength
        );
  
        // Compile the binary into a WebAssembly.Module.
        wasmModule = await WebAssembly.compile(wasmBytes);
  
        // Instantiate the module and run a test function.
        const instance = await WebAssembly.instantiate(wasmModule);
        const result = instance.exports.add(5, 3);
        output = `Compilation successful! Test: add(5, 3) = ${result}`;
  
        // Free the memory used by the WABT module.
        moduleObj.destroy();
      } catch (error) {
        output = `Error: ${error.message}`;
      }
    }
  
    function downloadWasm() {
      if (wasmBytes) {
        const blob = new Blob([wasmBytes], { type: "application/wasm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "program.wasm";
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  </script>
  
  <div class="container">
    <h2>WAT to WebAssembly Compiler</h2>
    
    <div class="editor">
      <textarea
        bind:value={watCode}
        placeholder="Enter WAT code here"
        spellcheck="false"
      ></textarea>
    </div>
  
    <div class="controls">
      <button on:click={compileWat}>Compile to WASM</button>
      <button on:click={downloadWasm} disabled={!wasmBytes}>
        Download WASM
      </button>
    </div>
  
    {#if output}
      <div class="output">
        <pre>{output}</pre>
      </div>
    {/if}
  </div>
  
  <style>
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
  
    .editor {
      margin: 20px 0;
    }
  
    textarea {
      width: 100%;
      height: 300px;
      font-family: monospace;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    .controls {
      margin: 20px 0;
    }
  
    button {
      margin-right: 10px;
      padding: 8px 16px;
      font-size: 14px;
    }
  
    .output {
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  
    pre {
      margin: 0;
      white-space: pre-wrap;
    }
  </style>