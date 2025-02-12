/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "aminichain.apigateway";

export interface JobTaskId {
  idJob: Long;
}

function createBaseJobTaskId(): JobTaskId {
  return { idJob: Long.UZERO };
}

export const JobTaskId = {
  encode(
    message: JobTaskId,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.idJob.isZero()) {
      writer.uint32(8).uint64(message.idJob);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobTaskId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobTaskId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.idJob = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JobTaskId {
    return {
      idJob: isSet(object.idJob) ? Long.fromValue(object.idJob) : Long.UZERO,
    };
  },

  toJSON(message: JobTaskId): unknown {
    const obj: any = {};
    message.idJob !== undefined &&
      (obj.idJob = (message.idJob || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JobTaskId>, I>>(
    object: I
  ): JobTaskId {
    const message = createBaseJobTaskId();
    message.idJob =
      object.idJob !== undefined && object.idJob !== null
        ? Long.fromValue(object.idJob)
        : Long.UZERO;
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
