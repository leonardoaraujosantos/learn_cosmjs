/* eslint-disable */
import { Params } from "./params";
import { JobTask } from "./job_task";
import {
  PageRequest,
  PageResponse,
} from "../../cosmos/base/query/v1beta1/pagination";
import Long from "long";
import { ComputeTask } from "./compute_task";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: Params;
}

export interface QueryJobStatusRequest {
  jobTaskId: Long;
}

export interface QueryJobStatusResponse {
  jobTask?: JobTask;
}

export interface QueryComputeTaskRequest {
  pagination?: PageRequest;
}

export interface QueryComputeTaskResponse {
  ComputeTask: ComputeTask[];
  pagination?: PageResponse;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(
    _: QueryParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(
    _: I
  ): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(
    object: I
  ): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    return message;
  },
};

function createBaseQueryJobStatusRequest(): QueryJobStatusRequest {
  return { jobTaskId: Long.UZERO };
}

export const QueryJobStatusRequest = {
  encode(
    message: QueryJobStatusRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.jobTaskId.isZero()) {
      writer.uint32(8).uint64(message.jobTaskId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryJobStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryJobStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobTaskId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryJobStatusRequest {
    return {
      jobTaskId: isSet(object.jobTaskId)
        ? Long.fromValue(object.jobTaskId)
        : Long.UZERO,
    };
  },

  toJSON(message: QueryJobStatusRequest): unknown {
    const obj: any = {};
    message.jobTaskId !== undefined &&
      (obj.jobTaskId = (message.jobTaskId || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryJobStatusRequest>, I>>(
    object: I
  ): QueryJobStatusRequest {
    const message = createBaseQueryJobStatusRequest();
    message.jobTaskId =
      object.jobTaskId !== undefined && object.jobTaskId !== null
        ? Long.fromValue(object.jobTaskId)
        : Long.UZERO;
    return message;
  },
};

function createBaseQueryJobStatusResponse(): QueryJobStatusResponse {
  return { jobTask: undefined };
}

export const QueryJobStatusResponse = {
  encode(
    message: QueryJobStatusResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.jobTask !== undefined) {
      JobTask.encode(message.jobTask, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryJobStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryJobStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobTask = JobTask.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryJobStatusResponse {
    return {
      jobTask: isSet(object.jobTask)
        ? JobTask.fromJSON(object.jobTask)
        : undefined,
    };
  },

  toJSON(message: QueryJobStatusResponse): unknown {
    const obj: any = {};
    message.jobTask !== undefined &&
      (obj.jobTask = message.jobTask
        ? JobTask.toJSON(message.jobTask)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryJobStatusResponse>, I>>(
    object: I
  ): QueryJobStatusResponse {
    const message = createBaseQueryJobStatusResponse();
    message.jobTask =
      object.jobTask !== undefined && object.jobTask !== null
        ? JobTask.fromPartial(object.jobTask)
        : undefined;
    return message;
  },
};

function createBaseQueryComputeTaskRequest(): QueryComputeTaskRequest {
  return { pagination: undefined };
}

export const QueryComputeTaskRequest = {
  encode(
    message: QueryComputeTaskRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryComputeTaskRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryComputeTaskRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryComputeTaskRequest {
    return {
      pagination: isSet(object.pagination)
        ? PageRequest.fromJSON(object.pagination)
        : undefined,
    };
  },

  toJSON(message: QueryComputeTaskRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryComputeTaskRequest>, I>>(
    object: I
  ): QueryComputeTaskRequest {
    const message = createBaseQueryComputeTaskRequest();
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQueryComputeTaskResponse(): QueryComputeTaskResponse {
  return { ComputeTask: [], pagination: undefined };
}

export const QueryComputeTaskResponse = {
  encode(
    message: QueryComputeTaskResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.ComputeTask) {
      ComputeTask.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryComputeTaskResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryComputeTaskResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ComputeTask.push(ComputeTask.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryComputeTaskResponse {
    return {
      ComputeTask: Array.isArray(object?.ComputeTask)
        ? object.ComputeTask.map((e: any) => ComputeTask.fromJSON(e))
        : [],
      pagination: isSet(object.pagination)
        ? PageResponse.fromJSON(object.pagination)
        : undefined,
    };
  },

  toJSON(message: QueryComputeTaskResponse): unknown {
    const obj: any = {};
    if (message.ComputeTask) {
      obj.ComputeTask = message.ComputeTask.map((e) =>
        e ? ComputeTask.toJSON(e) : undefined
      );
    } else {
      obj.ComputeTask = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryComputeTaskResponse>, I>>(
    object: I
  ): QueryComputeTaskResponse {
    const message = createBaseQueryComputeTaskResponse();
    message.ComputeTask =
      object.ComputeTask?.map((e) => ComputeTask.fromPartial(e)) || [];
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageResponse.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a specific JobStatus items. */
  JobStatus(request: QueryJobStatusRequest): Promise<QueryJobStatusResponse>;
  /** Queries a list of ComputeTask items. */
  ComputeTask(
    request: QueryComputeTaskRequest
  ): Promise<QueryComputeTaskResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.JobStatus = this.JobStatus.bind(this);
    this.ComputeTask = this.ComputeTask.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Query",
      "Params",
      data
    );
    return promise.then((data) =>
      QueryParamsResponse.decode(new _m0.Reader(data))
    );
  }

  JobStatus(request: QueryJobStatusRequest): Promise<QueryJobStatusResponse> {
    const data = QueryJobStatusRequest.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Query",
      "JobStatus",
      data
    );
    return promise.then((data) =>
      QueryJobStatusResponse.decode(new _m0.Reader(data))
    );
  }

  ComputeTask(
    request: QueryComputeTaskRequest
  ): Promise<QueryComputeTaskResponse> {
    const data = QueryComputeTaskRequest.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Query",
      "ComputeTask",
      data
    );
    return promise.then((data) =>
      QueryComputeTaskResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
