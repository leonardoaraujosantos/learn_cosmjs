<script>
    import { onMount } from "svelte";
    import wabtInit from "wabt"; // Installed via npm
  
    let watCode = `(module
    (func $add (param $a i32) (param $b i32) (result i32)
      local.get $a
      local.get $b
      i32.add)
    (export "add" (func $add)))`;
  
    let output = "";
    let wasmModule = null;
    let wasmBytes = null;
    let wabtInstance = null;
    let isError = false;
  
    onMount(async () => {
      try {
        wabtInstance = await wabtInit();
      } catch (error) {
        console.error("Failed to initialize WABT:", error);
        output = "Error: Failed to initialize WABT: " + error.message;
        isError = true;
      }
    });
  
    async function compileWat() {
      if (!wabtInstance) {
        output = "Error: WABT not initialized";
        isError = true;
        return;
      }
  
      try {
        const moduleObj = wabtInstance.parseWat("test.wat", watCode);
        const binaryResult = moduleObj.toBinary({ log: true });
        wasmBytes = binaryResult.buffer.slice(
          binaryResult.buffer.byteOffset,
          binaryResult.buffer.byteOffset + binaryResult.buffer.byteLength
        );
  
        wasmModule = await WebAssembly.compile(wasmBytes);
        const instance = await WebAssembly.instantiate(wasmModule);
        const result = instance.exports.add(5, 3);
  
        output = `Compilation successful! Test: add(5, 3) = ${result}`;
        isError = false;

        moduleObj.destroy();
      } catch (error) {
        output = `Error: ${error.message}`;
        isError = true;
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
        <h3 class="status-title {isError ? 'error-title' : 'success-title'}">
            WAT Compilation Status
        </h3>
        <div class="output {isError ? 'error' : 'success'}">
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

    .status-title {
        text-align: center;
        font-size: 18px;
        margin-top: 20px;
    }

    .error-title {
        color: red;
    }

    .success-title {
        color: green;
    }

    .output {
        margin-top: 10px;
        padding: 10px;
        border-radius: 4px;
        font-weight: bold;
    }

    .error {
        background-color: #ffebeb;
        color: red;
        border: 1px solid red;
    }

    .success {
        background-color: #e7fbe7;
        color: green;
        border: 1px solid green;
    }
</style>