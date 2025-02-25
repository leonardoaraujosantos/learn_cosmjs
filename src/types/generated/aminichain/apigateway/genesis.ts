/* eslint-disable */
import { Params } from "./params";
import { ComputeTaskId } from "./compute_task_id";
import { JobTaskId } from "./job_task_id";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

/** GenesisState defines the apigateway module's genesis state. */
export interface GenesisState {
  /** params defines all the parameters of the module. */
  params?: Params;
  computeTaskId?: ComputeTaskId;
  jobTaskId?: JobTaskId;
}

function createBaseGenesisState(): GenesisState {
  return { params: undefined, computeTaskId: undefined, jobTaskId: undefined };
}

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.computeTaskId !== undefined) {
      ComputeTaskId.encode(
        message.computeTaskId,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.jobTaskId !== undefined) {
      JobTaskId.encode(message.jobTaskId, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.computeTaskId = ComputeTaskId.decode(reader, reader.uint32());
          break;
        case 3:
          message.jobTaskId = JobTaskId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      computeTaskId: isSet(object.computeTaskId)
        ? ComputeTaskId.fromJSON(object.computeTaskId)
        : undefined,
      jobTaskId: isSet(object.jobTaskId)
        ? JobTaskId.fromJSON(object.jobTaskId)
        : undefined,
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.computeTaskId !== undefined &&
      (obj.computeTaskId = message.computeTaskId
        ? ComputeTaskId.toJSON(message.computeTaskId)
        : undefined);
    message.jobTaskId !== undefined &&
      (obj.jobTaskId = message.jobTaskId
        ? JobTaskId.toJSON(message.jobTaskId)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
    object: I
  ): GenesisState {
    const message = createBaseGenesisState();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    message.computeTaskId =
      object.computeTaskId !== undefined && object.computeTaskId !== null
        ? ComputeTaskId.fromPartial(object.computeTaskId)
        : undefined;
    message.jobTaskId =
      object.jobTaskId !== undefined && object.jobTaskId !== null
        ? JobTaskId.fromPartial(object.jobTaskId)
        : undefined;
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
