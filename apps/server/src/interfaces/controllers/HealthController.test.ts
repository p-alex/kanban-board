import { beforeEach, describe, expect, it } from "vitest";
import HealthController from "./HealthController.js";
import { IHttpRequest } from "../adapter/ExpressAdapter.js";

describe("HealthController.ts", () => {
  let healthController: HealthController;
  let testHttpRequest: IHttpRequest;

  beforeEach(() => {
    testHttpRequest = {
      body: undefined,
      params: undefined,
      query: undefined,
    };

    healthController = new HealthController();
  });

  it("should return pong", async () => {
    const response = await healthController.ping(testHttpRequest);
    expect(response.code).toBe(200);
    expect(response.success).toBe(true);
    expect(response.result).toBe("pong");
    expect(response.errors).toHaveLength(0);
  });
});
