import { describe, expect, it } from "vitest";
import dtoToUser from "./dtoToUser.js";

describe("dtoToUser.ts", () => {
  it("should convert correctly", () => {
    const result = dtoToUser({ id: "id", username: "username" });
    expect(result).toEqual({ id: "id", username: "username" });
  });
});
