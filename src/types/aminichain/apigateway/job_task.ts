/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

export interface JobTask {
  id: Long;
  webHookUrl: string;
  InputJson: string;
  done: boolean;
  startBlockHeight: Long;
  finishedBlockHeight: Long;
  computeTaskId: Long;
  Creator: string;
  Result: string;
  Executor: string;
}

function createBaseJobTask(): JobTask {
  return {
    id: Long.UZERO,
    webHookUrl: "",
    InputJson: "",
    done: false,
    startBlockHeight: Long.ZERO,
    finishedBlockHeight: Long.ZERO,
    computeTaskId: Long.UZERO,
    Creator: "",
    Result: "",
    Executor: "",
  };
}

export const JobTask = {
  encode(
    message: JobTask,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.webHookUrl !== "") {
      writer.uint32(18).string(message.webHookUrl);
    }
    if (message.InputJson !== "") {
      writer.uint32(26).string(message.InputJson);
    }
    if (message.done === true) {
      writer.uint32(32).bool(message.done);
    }
    if (!message.startBlockHeight.isZero()) {
      writer.uint32(40).int64(message.startBlockHeight);
    }
    if (!message.finishedBlockHeight.isZero()) {
      writer.uint32(48).int64(message.finishedBlockHeight);
    }
    if (!message.computeTaskId.isZero()) {
      writer.uint32(56).uint64(message.computeTaskId);
    }
    if (message.Creator !== "") {
      writer.uint32(66).string(message.Creator);
    }
    if (message.Result !== "") {
      writer.uint32(74).string(message.Result);
    }
    if (message.Executor !== "") {
      writer.uint32(82).string(message.Executor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobTask {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobTask();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint64() as Long;
          break;
        case 2:
          message.webHookUrl = reader.string();
          break;
        case 3:
          message.InputJson = reader.string();
          break;
        case 4:
          message.done = reader.bool();
          break;
        case 5:
          message.startBlockHeight = reader.int64() as Long;
          break;
        case 6:
          message.finishedBlockHeight = reader.int64() as Long;
          break;
        case 7:
          message.computeTaskId = reader.uint64() as Long;
          break;
        case 8:
          message.Creator = reader.string();
          break;
        case 9:
          message.Result = reader.string();
          break;
        case 10:
          message.Executor = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JobTask {
    return {
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      webHookUrl: isSet(object.webHookUrl) ? String(object.webHookUrl) : "",
      InputJson: isSet(object.InputJson) ? String(object.InputJson) : "",
      done: isSet(object.done) ? Boolean(object.done) : false,
      startBlockHeight: isSet(object.startBlockHeight)
        ? Long.fromValue(object.startBlockHeight)
        : Long.ZERO,
      finishedBlockHeight: isSet(object.finishedBlockHeight)
        ? Long.fromValue(object.finishedBlockHeight)
        : Long.ZERO,
      computeTaskId: isSet(object.computeTaskId)
        ? Long.fromValue(object.computeTaskId)
        : Long.UZERO,
      Creator: isSet(object.Creator) ? String(object.Creator) : "",
      Result: isSet(object.Result) ? String(object.Result) : "",
      Executor: isSet(object.Executor) ? String(object.Executor) : "",
    };
  },

  toJSON(message: JobTask): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    message.webHookUrl !== undefined && (obj.webHookUrl = message.webHookUrl);
    message.InputJson !== undefined && (obj.InputJson = message.InputJson);
    message.done !== undefined && (obj.done = message.done);
    message.startBlockHeight !== undefined &&
      (obj.startBlockHeight = (
        message.startBlockHeight || Long.ZERO
      ).toString());
    message.finishedBlockHeight !== undefined &&
      (obj.finishedBlockHeight = (
        message.finishedBlockHeight || Long.ZERO
      ).toString());
    message.computeTaskId !== undefined &&
      (obj.computeTaskId = (message.computeTaskId || Long.UZERO).toString());
    message.Creator !== undefined && (obj.Creator = message.Creator);
    message.Result !== undefined && (obj.Result = message.Result);
    message.Executor !== undefined && (obj.Executor = message.Executor);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JobTask>, I>>(object: I): JobTask {
    const message = createBaseJobTask();
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.webHookUrl = object.webHookUrl ?? "";
    message.InputJson = object.InputJson ?? "";
    message.done = object.done ?? false;
    message.startBlockHeight =
      object.startBlockHeight !== undefined && object.startBlockHeight !== null
        ? Long.fromValue(object.startBlockHeight)
        : Long.ZERO;
    message.finishedBlockHeight =
      object.finishedBlockHeight !== undefined &&
      object.finishedBlockHeight !== null
        ? Long.fromValue(object.finishedBlockHeight)
        : Long.ZERO;
    message.computeTaskId =
      object.computeTaskId !== undefined && object.computeTaskId !== null
        ? Long.fromValue(object.computeTaskId)
        : Long.UZERO;
    message.Creator = object.Creator ?? "";
    message.Result = object.Result ?? "";
    message.Executor = object.Executor ?? "";
    return message;
  },
};

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
