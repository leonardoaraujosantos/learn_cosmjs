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
    // Variável para armazenar o nome da função exportada
    let exportedFunctionName: string | null = null;
  
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
  
        // Identifica os nomes dos exports do módulo
        const exportNames = Object.keys(instance.exports);
        if (exportNames.length === 0) {
          throw new Error("No exports found in the compiled WASM.");
        }
        // Assume que o primeiro export é a função desejada
        exportedFunctionName = exportNames[0];
  
        // Faz o _cast_ da exportação para o tipo correto
        const exportedFunction = instance.exports[exportedFunctionName] as ((a: number, b: number) => number) | undefined;
        if (typeof exportedFunction !== "function") {
          throw new Error(`Exported member '${exportedFunctionName}' is not a function.`);
        }
        const result = exportedFunction(5, 3);
  
        output = `Compilation successful! Test: ${exportedFunctionName}(5, 3) = ${result}`;
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
        // Utiliza o nome da função exportada para o arquivo, ou "program" se não estiver definido
        a.download = `${exportedFunctionName || "program"}.wasm`;
        a.href = url;
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