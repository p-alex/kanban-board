import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BodyHandler from "./BodyHandler.js";
import BestHttpException from "../exceptions/BestHttpException.js";

describe("BodyHandler.ts", () => {
  let bodyHandler: BodyHandler;

  beforeEach(() => {
    bodyHandler = new BodyHandler();
  });

  it("it should handle application/json content type correctly", () => {
    const result = bodyHandler.handle("application/json", { test: "test" });

    expect(result).toBe('{"test":"test"}');
  });

  it("should throw an exception if an unsupported content type is passed", () => {
    try {
      bodyHandler.handle("unsupported", { test: "test" });
    } catch (error) {
      expect(error).toBeInstanceOf(BestHttpException);
    }
  });
});
