import { describe, expect, it } from "vitest";
import { connections, zones } from "../data";

describe("zones and connections", () => {
  it("keeps connections in the same order as zones (required for entrance animation sync)", () => {
    expect(connections.map(([id]) => id)).toEqual(zones.map((z) => z.id));
  });
});
