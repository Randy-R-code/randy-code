export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = JsonValue[];

export type JsonRootType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null";

export interface JsonParseError {
  message: string;
  position?: number;
  line?: number;
  column?: number;
}

export type JsonParseResult =
  | { success: true; value: JsonValue }
  | { success: false; error: JsonParseError };

export interface JsonStats {
  rootType: JsonRootType;
  properties: number;
  values: number;
  depth: number;
  characters: number;
  bytes: number;
}
