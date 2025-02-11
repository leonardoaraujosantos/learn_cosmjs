<script lang="ts">
    import { onMount } from "svelte";
    import wabtInit from "wabt"; // Biblioteca instalada via npm
  
    // Código WAT como string
    let watCode: string = `(module
      (func $add (param $a i32) (param $b i32) (result i32)
        local.get $a
        local.get $b
        i32.add)
      (export "add" (func $add)))`;
  
    // Variáveis com tipagem explícita
    let output: string = "";
    let wasmModule: WebAssembly.Module | null = null;
    let wasmBytes: Uint8Array | null = null;
    let wabtInstance: any = null; // Sem definições de tipo disponíveis, usamos 'any'
    let isError: boolean = false;
  
    onMount(async () => {
      try {
        wabtInstance = await wabtInit();
      } catch (error: unknown) {
        console.error("Failed to initialize WABT:", error);
        if (error instanceof Error) {
          output = "Error: Failed to initialize WABT: " + error.message;
        } else {
          output = "Error: Failed to initialize WABT.";
        }
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
        // Analisa o código WAT e gera um módulo
        const moduleObj = wabtInstance.parseWat("test.wat", watCode);
        const binaryResult = moduleObj.toBinary({ log: true });
        
        // Converte o ArrayBuffer para Uint8Array
        wasmBytes = new Uint8Array(
          binaryResult.buffer,
          binaryResult.buffer.byteOffset,
          binaryResult.buffer.byteLength
        );
  
        // Compila e instancia o módulo WASM
        wasmModule = await WebAssembly.compile(wasmBytes);
        const instance = await WebAssembly.instantiate(wasmModule);
  
        // Faz o _cast_ da exportação "add" para o tipo correto
        const add = instance.exports.add as ((a: number, b: number) => number) | undefined;
        if (typeof add !== "function") {
          throw new Error("Exported function 'add' is not available or not a function.");
        }
        const result = add(5, 3);
  
        output = `Compilation successful! Test: add(5, 3) = ${result}`;
        isError = false;
  
        // Libera recursos do módulo WAT
        moduleObj.destroy();
      } catch (error: unknown) {
        if (error instanceof Error) {
          output = `Error: ${error.message}`;
        } else {
          output = "Unknown error occurred.";
        }
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