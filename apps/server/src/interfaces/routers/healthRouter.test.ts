import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("../../ServerRouter.js", () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    getRouter: vi.fn().mockReturnValue("mockedRouter"),
  })),
}));

vi.mock("../adapter/ExpressAdapter.js", () => ({
  default: vi.fn(),
}));

vi.mock("../controllers/HealthController.js", () => ({
  default: vi.fn().mockImplementation(() => ({
    ping: "mockedPingHandler",
  })),
}));

describe("healthRouter", () => {
  let ServerRouter: any;
  let ExpressAdapter: any;
  let HealthController: any;

  beforeEach(async () => {
    vi.resetModules(); // Reset modules to ensure fresh imports
    ServerRouter = (await import("./ServerRouter.js")).default;
    ExpressAdapter = (await import("../adapter/ExpressAdapter.js")).default;
    HealthController = (await import("../controllers/HealthController.js"))
      .default;
  });

  test("should register the /health route", async () => {
    const mockGet = vi.fn();
    const mockGetRouter = vi.fn().mockReturnValue("mockedRouter");

    ServerRouter.mockImplementation(() => ({
      get: mockGet,
      getRouter: mockGetRouter,
    }));

    await import("./healthRouter.js"); // Adjust path

    expect(mockGet).toHaveBeenCalledWith("/health", "mockedPingHandler");
    expect(mockGetRouter).toHaveBeenCalled();
  });
});
