FROM --platform=linux node:lts-slim as base
ARG BUILDARCH

ENV PROTOC_VERSION=21.7
ENV TS_PROTO_VERSION=1.121.6

FROM base AS platform-amd64
ENV PROTOC_PLATFORM=x86_64

FROM base AS platform-arm64
ENV PROTOC_PLATFORM=aarch_64

FROM platform-${BUILDARCH}

RUN apt-get update
RUN apt-get install curl unzip --yes

# Install ProtoC
RUN mkdir -p /usr/lib/protoc
WORKDIR /usr/lib/protoc
RUN curl -L https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/protoc-${PROTOC_VERSION}-linux-${PROTOC_PLATFORM}.zip -o protoc.zip
RUN unzip -o protoc.zip
RUN rm protoc.zip
RUN ln -s /usr/lib/protoc/bin/protoc /usr/local/bin/protoc

# Install ts-proto
RUN npm install --global ts-proto@${TS_PROTO_VERSION} --save-exact

WORKDIR /

ENTRYPOINT [ "protoc" ]

