<script lang="ts">
    let file: File | null = null;
    let cid: string = "";
    let error: string = "";
    let isDragging: boolean = false;
    let isUploading: boolean = false;
  
    // Substitua com suas credenciais do Pinata
    const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  
    function handleDragOver(event: DragEvent) {
      event.preventDefault();
      isDragging = true;
    }
  
    function handleDragLeave(event: DragEvent) {
      event.preventDefault();
      isDragging = false;
    }
  
    function handleDrop(event: DragEvent) {
      event.preventDefault();
      isDragging = false;
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        file = event.dataTransfer.files[0];
        error = "";
        cid = "";
      }
    }
  
    async function uploadToIPFS() {
      if (!file) {
        error = "Nenhum arquivo selecionado!";
        return;
      }
      error = "";
      cid = "";
      isUploading = true;
      try {
        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        const formData = new FormData();
        formData.append("file", file);
  
        // Realiza o upload do arquivo para o Pinata
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          }
        });
        const data = await response.json();
  
        if (response.ok) {
          cid = data.IpfsHash;
        } else {
          error = data['error']['reason'] || "Erro no upload para o IPFS.";
          console.log('Failed to upload(response):', data);
        }
      } catch (err) {
        error = "Erro ao fazer o upload: " + err;
        console.log('Failed to upload(catch):', err);
      } finally {
        isUploading = false;
      }
    }
  
    function triggerFileInput() {
      document.getElementById("fileInput")?.click();
    }
  
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        triggerFileInput();
      }
    }
  
    function handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file = target.files[0];
        error = "";
        cid = "";
      }
    }
  </script>
  
  <div class="upload-container">
    <h2>Upload para o IPFS (Pinata)</h2>
  
    <!-- Área de Drag & Drop (Corrigida para acessibilidade) -->
    <div 
      class="dropzone {isDragging ? 'dragging' : ''}" 
      role="button"
      tabindex="0"
      aria-label="Área para arrastar e soltar arquivos"
      on:dragover={handleDragOver} 
      on:dragleave={handleDragLeave} 
      on:drop={handleDrop}
      on:click={triggerFileInput}
      on:keydown={handleKeyPress}
    >
      {#if file}
        <p>Arquivo selecionado: <strong>{file.name}</strong></p>
      {:else}
        <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
      {/if}
    </div>
  
    <!-- Input oculto para selecionar arquivo via clique -->
    <input id="fileInput" type="file" on:change={handleFileChange} style="display:none" />
  
    <!-- Botão de Upload -->
    <button on:click={uploadToIPFS} disabled={!file || isUploading}>
      {isUploading ? "Enviando..." : "Upload to IPFS"}
    </button>
  
    <!-- Exibe o CID ou mensagens de erro em uma caixa similar ao status de compilação -->
    {#if cid || error}
      <h3 class="status-title {error ? 'error-title' : 'success-title'}">
        IPFS Upload Status
      </h3>
      <div class="output {error ? 'error' : 'success'}">
        {#if error}
          <p>{error}</p>
        {:else}
          <p><strong>CID do arquivo:</strong> <code>{cid}</code></p>
        {/if}
      </div>
    {/if}
  </div>
  
  <style>
    .upload-container {
      max-width: 500px;
      margin: 20px auto;
      text-align: center;
      font-family: sans-serif;
    }
  
    .dropzone {
      border: 2px dashed #ccc;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 15px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      outline: none;
    }
  
    .dropzone:focus, .dropzone:hover {
      background-color: #f5f5f5;
      border-color: #888;
    }
  
    .dropzone.dragging {
      background-color: #e0e0e0;
    }
  
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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