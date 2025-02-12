/* eslint-disable */
import { Params } from "./params";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

/** MsgUpdateParams is the Msg/UpdateParams request type. */
export interface MsgUpdateParams {
  /** authority is the address that controls the module (defaults to x/gov unless overwritten). */
  authority: string;
  /** NOTE: All parameters must be supplied. */
  params?: Params;
}

/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 */
export interface MsgUpdateParamsResponse {}

export interface MsgRegisterComputeTask {
  creator: string;
  description: string;
  uri: string;
  inputShape: string;
  outputShape: string;
  computeType: Long;
  inputSample: string;
}

export interface MsgRegisterComputeTaskResponse {
  computeId: Long;
}

export interface MsgScheduleJob {
  creator: string;
  computeTaskId: Long;
  webhookUrl: string;
  inputJson: string;
}

export interface MsgScheduleJobResponse {
  taskId: Long;
}

export interface MsgOraclePushResult {
  creator: string;
  jobId: Long;
  resultsJson: string;
}

export interface MsgOraclePushResultResponse {
  status: string;
}

function createBaseMsgUpdateParams(): MsgUpdateParams {
  return { authority: "", params: undefined };
}

export const MsgUpdateParams = {
  encode(
    message: MsgUpdateParams,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: MsgUpdateParams): unknown {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(
    object: I
  ): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    return message;
  },
};

function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}

export const MsgUpdateParamsResponse = {
  encode(
    _: MsgUpdateParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgUpdateParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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

  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },

  toJSON(_: MsgUpdateParamsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(
    _: I
  ): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
};

function createBaseMsgRegisterComputeTask(): MsgRegisterComputeTask {
  return {
    creator: "",
    description: "",
    uri: "",
    inputShape: "",
    outputShape: "",
    computeType: Long.UZERO,
    inputSample: "",
  };
}

export const MsgRegisterComputeTask = {
  encode(
    message: MsgRegisterComputeTask,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.uri !== "") {
      writer.uint32(26).string(message.uri);
    }
    if (message.inputShape !== "") {
      writer.uint32(34).string(message.inputShape);
    }
    if (message.outputShape !== "") {
      writer.uint32(42).string(message.outputShape);
    }
    if (!message.computeType.isZero()) {
      writer.uint32(48).uint64(message.computeType);
    }
    if (message.inputSample !== "") {
      writer.uint32(58).string(message.inputSample);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgRegisterComputeTask {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterComputeTask();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.uri = reader.string();
          break;
        case 4:
          message.inputShape = reader.string();
          break;
        case 5:
          message.outputShape = reader.string();
          break;
        case 6:
          message.computeType = reader.uint64() as Long;
          break;
        case 7:
          message.inputSample = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterComputeTask {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      description: isSet(object.description) ? String(object.description) : "",
      uri: isSet(object.uri) ? String(object.uri) : "",
      inputShape: isSet(object.inputShape) ? String(object.inputShape) : "",
      outputShape: isSet(object.outputShape) ? String(object.outputShape) : "",
      computeType: isSet(object.computeType)
        ? Long.fromValue(object.computeType)
        : Long.UZERO,
      inputSample: isSet(object.inputSample) ? String(object.inputSample) : "",
    };
  },

  toJSON(message: MsgRegisterComputeTask): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.description !== undefined &&
      (obj.description = message.description);
    message.uri !== undefined && (obj.uri = message.uri);
    message.inputShape !== undefined && (obj.inputShape = message.inputShape);
    message.outputShape !== undefined &&
      (obj.outputShape = message.outputShape);
    message.computeType !== undefined &&
      (obj.computeType = (message.computeType || Long.UZERO).toString());
    message.inputSample !== undefined &&
      (obj.inputSample = message.inputSample);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRegisterComputeTask>, I>>(
    object: I
  ): MsgRegisterComputeTask {
    const message = createBaseMsgRegisterComputeTask();
    message.creator = object.creator ?? "";
    message.description = object.description ?? "";
    message.uri = object.uri ?? "";
    message.inputShape = object.inputShape ?? "";
    message.outputShape = object.outputShape ?? "";
    message.computeType =
      object.computeType !== undefined && object.computeType !== null
        ? Long.fromValue(object.computeType)
        : Long.UZERO;
    message.inputSample = object.inputSample ?? "";
    return message;
  },
};

function createBaseMsgRegisterComputeTaskResponse(): MsgRegisterComputeTaskResponse {
  return { computeId: Long.UZERO };
}

export const MsgRegisterComputeTaskResponse = {
  encode(
    message: MsgRegisterComputeTaskResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.computeId.isZero()) {
      writer.uint32(8).uint64(message.computeId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgRegisterComputeTaskResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterComputeTaskResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.computeId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterComputeTaskResponse {
    return {
      computeId: isSet(object.computeId)
        ? Long.fromValue(object.computeId)
        : Long.UZERO,
    };
  },

  toJSON(message: MsgRegisterComputeTaskResponse): unknown {
    const obj: any = {};
    message.computeId !== undefined &&
      (obj.computeId = (message.computeId || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRegisterComputeTaskResponse>, I>>(
    object: I
  ): MsgRegisterComputeTaskResponse {
    const message = createBaseMsgRegisterComputeTaskResponse();
    message.computeId =
      object.computeId !== undefined && object.computeId !== null
        ? Long.fromValue(object.computeId)
        : Long.UZERO;
    return message;
  },
};

function createBaseMsgScheduleJob(): MsgScheduleJob {
  return {
    creator: "",
    computeTaskId: Long.UZERO,
    webhookUrl: "",
    inputJson: "",
  };
}

export const MsgScheduleJob = {
  encode(
    message: MsgScheduleJob,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (!message.computeTaskId.isZero()) {
      writer.uint32(16).uint64(message.computeTaskId);
    }
    if (message.webhookUrl !== "") {
      writer.uint32(26).string(message.webhookUrl);
    }
    if (message.inputJson !== "") {
      writer.uint32(34).string(message.inputJson);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgScheduleJob {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgScheduleJob();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.computeTaskId = reader.uint64() as Long;
          break;
        case 3:
          message.webhookUrl = reader.string();
          break;
        case 4:
          message.inputJson = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgScheduleJob {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      computeTaskId: isSet(object.computeTaskId)
        ? Long.fromValue(object.computeTaskId)
        : Long.UZERO,
      webhookUrl: isSet(object.webhookUrl) ? String(object.webhookUrl) : "",
      inputJson: isSet(object.inputJson) ? String(object.inputJson) : "",
    };
  },

  toJSON(message: MsgScheduleJob): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.computeTaskId !== undefined &&
      (obj.computeTaskId = (message.computeTaskId || Long.UZERO).toString());
    message.webhookUrl !== undefined && (obj.webhookUrl = message.webhookUrl);
    message.inputJson !== undefined && (obj.inputJson = message.inputJson);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgScheduleJob>, I>>(
    object: I
  ): MsgScheduleJob {
    const message = createBaseMsgScheduleJob();
    message.creator = object.creator ?? "";
    message.computeTaskId =
      object.computeTaskId !== undefined && object.computeTaskId !== null
        ? Long.fromValue(object.computeTaskId)
        : Long.UZERO;
    message.webhookUrl = object.webhookUrl ?? "";
    message.inputJson = object.inputJson ?? "";
    return message;
  },
};

function createBaseMsgScheduleJobResponse(): MsgScheduleJobResponse {
  return { taskId: Long.UZERO };
}

export const MsgScheduleJobResponse = {
  encode(
    message: MsgScheduleJobResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.taskId.isZero()) {
      writer.uint32(8).uint64(message.taskId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgScheduleJobResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgScheduleJobResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.taskId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgScheduleJobResponse {
    return {
      taskId: isSet(object.taskId) ? Long.fromValue(object.taskId) : Long.UZERO,
    };
  },

  toJSON(message: MsgScheduleJobResponse): unknown {
    const obj: any = {};
    message.taskId !== undefined &&
      (obj.taskId = (message.taskId || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgScheduleJobResponse>, I>>(
    object: I
  ): MsgScheduleJobResponse {
    const message = createBaseMsgScheduleJobResponse();
    message.taskId =
      object.taskId !== undefined && object.taskId !== null
        ? Long.fromValue(object.taskId)
        : Long.UZERO;
    return message;
  },
};

function createBaseMsgOraclePushResult(): MsgOraclePushResult {
  return { creator: "", jobId: Long.UZERO, resultsJson: "" };
}

export const MsgOraclePushResult = {
  encode(
    message: MsgOraclePushResult,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (!message.jobId.isZero()) {
      writer.uint32(16).uint64(message.jobId);
    }
    if (message.resultsJson !== "") {
      writer.uint32(26).string(message.resultsJson);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgOraclePushResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgOraclePushResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.jobId = reader.uint64() as Long;
          break;
        case 3:
          message.resultsJson = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgOraclePushResult {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      jobId: isSet(object.jobId) ? Long.fromValue(object.jobId) : Long.UZERO,
      resultsJson: isSet(object.resultsJson) ? String(object.resultsJson) : "",
    };
  },

  toJSON(message: MsgOraclePushResult): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.jobId !== undefined &&
      (obj.jobId = (message.jobId || Long.UZERO).toString());
    message.resultsJson !== undefined &&
      (obj.resultsJson = message.resultsJson);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgOraclePushResult>, I>>(
    object: I
  ): MsgOraclePushResult {
    const message = createBaseMsgOraclePushResult();
    message.creator = object.creator ?? "";
    message.jobId =
      object.jobId !== undefined && object.jobId !== null
        ? Long.fromValue(object.jobId)
        : Long.UZERO;
    message.resultsJson = object.resultsJson ?? "";
    return message;
  },
};

function createBaseMsgOraclePushResultResponse(): MsgOraclePushResultResponse {
  return { status: "" };
}

export const MsgOraclePushResultResponse = {
  encode(
    message: MsgOraclePushResultResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgOraclePushResultResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgOraclePushResultResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgOraclePushResultResponse {
    return {
      status: isSet(object.status) ? String(object.status) : "",
    };
  },

  toJSON(message: MsgOraclePushResultResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgOraclePushResultResponse>, I>>(
    object: I
  ): MsgOraclePushResultResponse {
    const message = createBaseMsgOraclePushResultResponse();
    message.status = object.status ?? "";
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /**
   * UpdateParams defines a (governance) operation for updating the module
   * parameters. The authority defaults to the x/gov module account.
   */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
  RegisterComputeTask(
    request: MsgRegisterComputeTask
  ): Promise<MsgRegisterComputeTaskResponse>;
  ScheduleJob(request: MsgScheduleJob): Promise<MsgScheduleJobResponse>;
  OraclePushResult(
    request: MsgOraclePushResult
  ): Promise<MsgOraclePushResultResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.UpdateParams = this.UpdateParams.bind(this);
    this.RegisterComputeTask = this.RegisterComputeTask.bind(this);
    this.ScheduleJob = this.ScheduleJob.bind(this);
    this.OraclePushResult = this.OraclePushResult.bind(this);
  }
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Msg",
      "UpdateParams",
      data
    );
    return promise.then((data) =>
      MsgUpdateParamsResponse.decode(new _m0.Reader(data))
    );
  }

  RegisterComputeTask(
    request: MsgRegisterComputeTask
  ): Promise<MsgRegisterComputeTaskResponse> {
    const data = MsgRegisterComputeTask.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Msg",
      "RegisterComputeTask",
      data
    );
    return promise.then((data) =>
      MsgRegisterComputeTaskResponse.decode(new _m0.Reader(data))
    );
  }

  ScheduleJob(request: MsgScheduleJob): Promise<MsgScheduleJobResponse> {
    const data = MsgScheduleJob.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Msg",
      "ScheduleJob",
      data
    );
    return promise.then((data) =>
      MsgScheduleJobResponse.decode(new _m0.Reader(data))
    );
  }

  OraclePushResult(
    request: MsgOraclePushResult
  ): Promise<MsgOraclePushResultResponse> {
    const data = MsgOraclePushResult.encode(request).finish();
    const promise = this.rpc.request(
      "aminichain.apigateway.Msg",
      "OraclePushResult",
      data
    );
    return promise.then((data) =>
      MsgOraclePushResultResponse.decode(new _m0.Reader(data))
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
