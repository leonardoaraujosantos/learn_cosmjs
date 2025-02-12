#!/bin/bash

# Criar diretório de saída se não existir
mkdir -p ./src/types/generated

# Definir caminho para o `protoc`
PROTOC=~/.local/protoc/bin/protoc

# Verificar se o protoc está instalado
if ! command -v $PROTOC &> /dev/null
then
    echo "Erro: protoc não encontrado. Certifique-se de que está instalado em ~/.local/protoc/bin/"
    exit 1
fi

# Definir o diretório de trabalho
WORKSPACE=$(pwd)

# Diretório onde o `protoc-gen-ts_proto` está instalado via npm
PROTOC_GEN_TS_PROTO=$(npm root -g)/ts-proto/protoc-gen-ts_proto

# Verificar se o `protoc-gen-ts_proto` está instalado
if [ ! -f "$PROTOC_GEN_TS_PROTO" ]; then
    echo "Erro: protoc-gen-ts_proto não encontrado. Instale-o com:"
    echo "npm install -g ts-proto"
    exit 1
fi

# Definir o caminho correto do proto_path
PROTO_PATH="${WORKSPACE}/proto"

# Compilar arquivos .proto
for file in "${WORKSPACE}"/proto/aminichain/apigateway/*.proto; do
    echo "Compilando $file..."
    $PROTOC \
        --plugin=protoc-gen-ts_proto="$PROTOC_GEN_TS_PROTO" \
        --ts_proto_out="./src/types/generated" \
        --proto_path="$PROTO_PATH" \
        --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=messages" \
        "$file"
done

echo "✅ Compilação dos arquivos proto concluída. Verifique ./src/types/generated para os arquivos gerados."