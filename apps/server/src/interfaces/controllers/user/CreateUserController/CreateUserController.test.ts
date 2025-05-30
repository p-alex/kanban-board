import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import CreateUserService from "../../../../application/services/user/CreateUserService/CreateUserService.js";
import CreateUserController from "./CreateUserController.js";
import {
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/ExpressAdapter.js";
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import { userFixture } from "../../../../__fixtures__/user/index.js";

describe("CreateUserController.ts", () => {
  let createUserServiceMock: Mocked<CreateUserService>;

  let createUserController: CreateUserController;

  const userData = {
    username: "username",
    email: "email",
    password: "password",
  };

  const mockHttpReq: IHttpRequest<CreateUserRequestDto> = {
    body: userData,
    params: {},
    query: {},
  };

  const mockHttpRes: IHttpResponse<CreateUserResponseDto> = {
    code: 201,
    success: true,
    errors: [],
    result: {
      userDto: { id: "id", username: "username" },
    },
  };

  beforeEach(() => {
    createUserServiceMock = {
      execute: vi.fn().mockResolvedValue({
        userDto: { id: "id", username: "username" },
      }),
    } as unknown as Mocked<CreateUserService>;

    createUserController = new CreateUserController(createUserServiceMock);
  });

  it("should handle user creation", async () => {
    const result = await createUserController.handle(mockHttpReq);

    expect(createUserServiceMock.execute).toHaveBeenCalledWith(userData);

    expect(result).toEqual(mockHttpRes);
  });
});
