import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateUserService from "../../../../application/services/user/CreateUserService/CreateUserService.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import CreateUserController from "./CreateUserController.js";
import {
  httpRequestFactory,
  IHandlerResponse,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";

describe("CreateUserController.ts", () => {
  let mockHttpReq: IHttpRequest<CreateUserRequestDto>;
  let createUserService: CreateUserService;
  let httpResponseFactory: HttpResponseFactory;
  let createUserController: CreateUserController;

  const createUserServiceResponse: CreateUserResponseDto = {
    userDto: {
      id: "user-id",
      username: "newuser",
    },
  };

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    mockHttpReq.body = {
      username: "newuser",
      email: "newuser@example.com",
      password: "strongpassword",
    };

    createUserService = {
      execute: vi.fn().mockResolvedValue(createUserServiceResponse),
    } as unknown as CreateUserService;

    const mockHttpResponse: IHttpResponse<CreateUserResponseDto> = {
      code: 201,
      errors: [],
      result: createUserServiceResponse,
      success: true,
    };

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as HttpResponseFactory;

    createUserController = new CreateUserController(
      createUserService,
      httpResponseFactory
    );
  });

  it("should call createUserService with correct arguments", async () => {
    await createUserController.handle(mockHttpReq);

    expect(createUserService.execute).toHaveBeenCalledWith(mockHttpReq.body);
  });

  it("should return the correct response", async () => {
    const result = await createUserController.handle(mockHttpReq);

    const handlerResponse: IHandlerResponse<CreateUserResponseDto> = {
      response: {
        code: 201,
        errors: [],
        result: {
          userDto: { id: "user-id", username: "newuser" },
        },
        success: true,
      },
    };

    expect(result).toEqual(handlerResponse);
  });
});
