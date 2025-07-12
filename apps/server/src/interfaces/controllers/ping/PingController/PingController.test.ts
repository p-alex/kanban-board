import { beforeEach, describe, expect, it } from "vitest";

import PingController from "./PingController.js";
import { IHttpRequest } from "../../../adapter/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";

describe("PingController.ts", () => {
  let pingController: PingController;
  let testHttpRequest: IHttpRequest;

  beforeEach(() => {
    testHttpRequest = {
      body: undefined,
      params: undefined,
      query: undefined,
      accessToken: "",
      client_ip: "",
      cookies: { key: "value" },
      method: "get",
      url: "url",
      user: undefined,
    };

    pingController = new PingController(httpResponseFactory);
  });

  it("should return pong", async () => {
    const response = await pingController.handle(testHttpRequest);
    expect(response.response.code).toBe(200);
    expect(response.response.success).toBe(true);
    expect(response.response.result).toBe("pong");
    expect(response.response.errors).toHaveLength(0);
  });
});
