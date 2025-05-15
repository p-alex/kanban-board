import { describe, expect, it } from "vitest";
import randomColor from "./generateHexColor.js";

describe("generateHexColor.ts", () => {
  it("should return correct hex color", () => {
    const result = randomColor();

    const regex = /#([A-Fa-f0-9]{6})/g;

    const isValid = regex.test(result);

    expect(isValid).toBe(true);
    expect(result).toHaveLength(7);
  });
});
