#!/bin/bash

COSMOS_SDK_VERSION="v0.50.11"
FALLBACK_COSMOS_SDK_VERSION="v0.45.4"
COSMOS_PROTO_VERSION="main"  # Última versão do cosmos-proto
PROTO_DIR="./proto"

# Criar diretórios necessários
mkdir -p ${PROTO_DIR}/google/api
mkdir -p ${PROTO_DIR}/gogoproto
mkdir -p ${PROTO_DIR}/cosmos/base/query/v1beta1
mkdir -p ${PROTO_DIR}/cosmos/msg/v1
mkdir -p ${PROTO_DIR}/cosmos_proto
mkdir -p ${PROTO_DIR}/amino

# Baixar arquivos proto do Cosmos SDK
curl -sSfLo ${PROTO_DIR}/gogoproto/gogo.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${FALLBACK_COSMOS_SDK_VERSION}/third_party/proto/gogoproto/gogo.proto"
curl -sSfLo ${PROTO_DIR}/google/api/annotations.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${FALLBACK_COSMOS_SDK_VERSION}/third_party/proto/google/api/annotations.proto"
curl -sSfLo ${PROTO_DIR}/google/api/http.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${FALLBACK_COSMOS_SDK_VERSION}/third_party/proto/google/api/http.proto"
curl -sSfLo ${PROTO_DIR}/cosmos/base/query/v1beta1/pagination.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${COSMOS_SDK_VERSION}/proto/cosmos/base/query/v1beta1/pagination.proto"
curl -sSfLo ${PROTO_DIR}/cosmos/msg/v1/msg.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${COSMOS_SDK_VERSION}/proto/cosmos/msg/v1/msg.proto"
curl -sSfLo ${PROTO_DIR}/amino/amino.proto "https://raw.githubusercontent.com/cosmos/cosmos-sdk/${COSMOS_SDK_VERSION}/proto/amino/amino.proto"

# Baixar cosmos.proto do repositório cosmos-proto correto
curl -sSfLo ${PROTO_DIR}/cosmos_proto/cosmos.proto "https://raw.githubusercontent.com/cosmos/cosmos-proto/${COSMOS_PROTO_VERSION}/proto/cosmos_proto/cosmos.proto"

echo "✅ Todos os arquivos .proto foram baixados com sucesso!"