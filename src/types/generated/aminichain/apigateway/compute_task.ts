/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

export interface ComputeTask {
  id: Long;
  desc: string;
  url: string;
  inputShape: string;
  outputShape: string;
  inputSample: string;
  computeType: Long;
  Creator: string;
}

function createBaseComputeTask(): ComputeTask {
  return {
    id: Long.UZERO,
    desc: "",
    url: "",
    inputShape: "",
    outputShape: "",
    inputSample: "",
    computeType: Long.UZERO,
    Creator: "",
  };
}

export const ComputeTask = {
  encode(
    message: ComputeTask,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.desc !== "") {
      writer.uint32(18).string(message.desc);
    }
    if (message.url !== "") {
      writer.uint32(26).string(message.url);
    }
    if (message.inputShape !== "") {
      writer.uint32(34).string(message.inputShape);
    }
    if (message.outputShape !== "") {
      writer.uint32(42).string(message.outputShape);
    }
    if (message.inputSample !== "") {
      writer.uint32(50).string(message.inputSample);
    }
    if (!message.computeType.isZero()) {
      writer.uint32(56).uint64(message.computeType);
    }
    if (message.Creator !== "") {
      writer.uint32(66).string(message.Creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComputeTask {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComputeTask();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint64() as Long;
          break;
        case 2:
          message.desc = reader.string();
          break;
        case 3:
          message.url = reader.string();
          break;
        case 4:
          message.inputShape = reader.string();
          break;
        case 5:
          message.outputShape = reader.string();
          break;
        case 6:
          message.inputSample = reader.string();
          break;
        case 7:
          message.computeType = reader.uint64() as Long;
          break;
        case 8:
          message.Creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ComputeTask {
    return {
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      desc: isSet(object.desc) ? String(object.desc) : "",
      url: isSet(object.url) ? String(object.url) : "",
      inputShape: isSet(object.inputShape) ? String(object.inputShape) : "",
      outputShape: isSet(object.outputShape) ? String(object.outputShape) : "",
      inputSample: isSet(object.inputSample) ? String(object.inputSample) : "",
      computeType: isSet(object.computeType)
        ? Long.fromValue(object.computeType)
        : Long.UZERO,
      Creator: isSet(object.Creator) ? String(object.Creator) : "",
    };
  },

  toJSON(message: ComputeTask): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    message.desc !== undefined && (obj.desc = message.desc);
    message.url !== undefined && (obj.url = message.url);
    message.inputShape !== undefined && (obj.inputShape = message.inputShape);
    message.outputShape !== undefined &&
      (obj.outputShape = message.outputShape);
    message.inputSample !== undefined &&
      (obj.inputSample = message.inputSample);
    message.computeType !== undefined &&
      (obj.computeType = (message.computeType || Long.UZERO).toString());
    message.Creator !== undefined && (obj.Creator = message.Creator);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ComputeTask>, I>>(
    object: I
  ): ComputeTask {
    const message = createBaseComputeTask();
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.desc = object.desc ?? "";
    message.url = object.url ?? "";
    message.inputShape = object.inputShape ?? "";
    message.outputShape = object.outputShape ?? "";
    message.inputSample = object.inputSample ?? "";
    message.computeType =
      object.computeType !== undefined && object.computeType !== null
        ? Long.fromValue(object.computeType)
        : Long.UZERO;
    message.Creator = object.Creator ?? "";
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
