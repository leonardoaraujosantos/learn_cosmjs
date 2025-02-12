#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p ./src/types/generated

# Get absolute path of current directory
WORKSPACE=$(pwd)

# Compile proto files using Docker
ls "${WORKSPACE}"/proto/aminichain/apigateway/*.proto | xargs -I {} basename {} | xargs -I {} \
    docker run --rm -i \
    -v "${WORKSPACE}":/project -w /project \
    ts-protoc \
    --plugin="/usr/local/lib/node_modules/ts-proto/protoc-gen-ts_proto" \
    --ts_proto_out="./src/types/generated" \
    --proto_path="./proto" \
    --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=messages" \
    aminichain/apigateway/{}

echo "✅ Compilação dos arquivos proto concluída(Docker). Verifique ./src/types/generated para os arquivos gerados."

