import { describe, it, expect, vi, beforeEach } from "vitest";
import express, { Request, Response } from "express";
import request from "supertest";
import Adapter from "../adapter/Adapter.js";
import ServerRouter from "./ServerRouter.js";
import { IHttpRequest, IHttpResponse } from "../adapter/ExpressAdapter.js";

describe("ServerRouter", () => {
  let mockAdapter: Adapter;
  let serverRouter: ServerRouter;
  let app: express.Express;

  beforeEach(() => {
    // Mock the Adapter
    mockAdapter = {
      adapt: vi.fn((controller) => (req: Request, res: Response) => {
        controller(req as unknown as IHttpRequest)
          .then((response: IHttpResponse<any>) => res.json(response))
          .catch(() =>
            res.status(500).json({ error: "Internal Server Error" })
          );
      }),
    } as unknown as Adapter;

    // Create a new instance of ServerRouter with the mocked adapter
    serverRouter = new ServerRouter(mockAdapter);

    // Setup Express app
    app = express();
    app.use(express.json()); // Required for JSON body parsing
    app.use(serverRouter.getRouter());
  });

  it("should handle GET requests and return a response", async () => {
    // Mock controller function
    const mockController = vi.fn(async (httpRequest: IHttpRequest) => ({
      code: 200,
      success: true,
      result: { message: "Hello, world!" },
      errors: [],
    }));

    // Register the mock controller for a route
    serverRouter.get("/test", mockController);

    // Perform the request
    const response = await request(app).get("/test");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      success: true,
      result: { message: "Hello, world!" },
      errors: [],
    });

    // Ensure the controller was called
    expect(mockController).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if the controller throws an error", async () => {
    // Mock controller function that throws an error
    const mockController = vi.fn(async () => {
      throw new Error("Test Error");
    });

    // Register the mock controller
    serverRouter.get("/error", mockController);

    // Perform the request
    const response = await request(app).get("/error");

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });

    // Ensure the controller was called
    expect(mockController).toHaveBeenCalledTimes(1);
  });
});
