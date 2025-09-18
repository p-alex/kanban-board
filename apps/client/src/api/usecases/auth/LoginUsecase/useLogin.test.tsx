import { Mocked, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLogin from "./useLogin";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance";
import { UsecaseResponseFactory } from "../..";
import { LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";
import { userDtoMock } from "../../../../__fixtures__/user";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException";

// Mock dependencies
import UserTransformer from "../../../dtoTransformers/userTransformer/UserTransformer";
import extractApiErrorMessage from "../../../extractApiErrorMessage";

vi.mock("../../../dtoTransformers/userTransformer/UserTransformer", () => ({
  default: { dtoToUser: vi.fn() },
}));

vi.mock("../../../extractApiErrorMessage", () => ({
  default: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useLogin", () => {
  let httpMock: Mocked<BestHttpInstance>;
  let sendFn: Mock;
  const credentials = { email: "email", password: "password" };
  const responseData: LoginResponseDto = {
    userDto: userDtoMock,
    accessToken: "accessToken",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sendFn = vi.fn();
    httpMock = { send: sendFn } as unknown as Mocked<BestHttpInstance>;
    (UserTransformer.dtoToUser as Mock).mockReturnValue({
      id: 1,
      name: "John",
    });
    (extractApiErrorMessage as Mock).mockImplementation(
      ({ defaultErrorMessage }) => defaultErrorMessage
    );
  });

  it("should send request with correct params", async () => {
    const { result } = renderHook(() => useLogin({ httpClient: httpMock }), {
      wrapper,
    });

    await result.current(credentials);

    expect(httpMock.send).toHaveBeenCalledWith("/auth/login", {
      method: "post",
      body: credentials,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  });

  it("should return success response when httpClient.send resolves successfully", async () => {
    sendFn.mockResolvedValue({
      success: true,
      data: { result: responseData },
    });

    const { result } = renderHook(() => useLogin({ httpClient: httpMock }), {
      wrapper,
    });
    const response = await result.current(credentials);

    expect(UserTransformer.dtoToUser).toHaveBeenCalledWith(
      responseData.userDto
    );
    expect(response).toEqual(
      UsecaseResponseFactory.success({
        user: { id: 1, name: "John" },
        accessToken: responseData.accessToken,
      })
    );
  });

  it("should return error response if httpClient.send throws", async () => {
    const error = new BestHttpResponseException(400, ["request error"], {
      errors: ["the error"],
    });
    sendFn.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin({ httpClient: httpMock }), {
      wrapper,
    });
    const response = await result.current(credentials);

    expect(extractApiErrorMessage).toHaveBeenCalledWith({
      error,
      defaultErrorMessage: "Login failed... Try again later.",
    });
    expect(response).toEqual(
      UsecaseResponseFactory.error("Login failed... Try again later.")
    );
  });

  it("should return error response if response.success is false", async () => {
    sendFn.mockResolvedValue({
      success: false,
      data: { errors: ["invalid credentials"] },
    });

    const { result } = renderHook(() => useLogin({ httpClient: httpMock }), {
      wrapper,
    });
    const response = await result.current(credentials);

    expect(response).toEqual(
      UsecaseResponseFactory.error("Login failed... Try again later.")
    );
  });
});
