import { beforeEach, describe, expect, it } from "vitest";
import BestHttp from "./BestHttp.js";

describe("BestHttp.ts", () => {
  let bestHttp: BestHttp;

  beforeEach(() => {
    bestHttp = new BestHttp({});
  });

  it("should apply default config if no config options are passed to create function", () => {
    bestHttp.create();

    expect(bestHttp.getDefaultConfig()).toEqual({
      url: "/",
      method: "get",
      body: undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: undefined,
      },
      withCredentials: false,
    });
  });
});
