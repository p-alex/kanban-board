import { beforeEach, describe, expect, it } from "vitest";
import { IHttpRequest } from "../../adapter/ExpressAdapter.js";
import PingController from "./PingController.js";

describe("PingController.ts", () => {
  let pingController: PingController;
  let testHttpRequest: IHttpRequest;

  beforeEach(() => {
    testHttpRequest = {
      body: undefined,
      params: undefined,
      query: undefined,
    };

    pingController = new PingController();
  });

  it("should return pong", async () => {
    const response = await pingController.ping(testHttpRequest);
    expect(response.code).toBe(200);
    expect(response.success).toBe(true);
    expect(response.result).toBe("pong");
    expect(response.errors).toHaveLength(0);
  });
});
