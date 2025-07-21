import { describe, expect, it } from "vitest";
import generateSlug from "./generateSlug.js";

describe("generateSlug.ts", () => {
  it("should create a slug", () => {
    const slug = generateSlug("THIS IS THE TEXT");
    expect(slug).toBe("this-is-the-text");
  });
});
