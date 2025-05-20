import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UserController from "./UserController.js";
import UserService from "apps/server/src/application/services/UserService.js";
import { IHttpRequest } from "../../adapter/ExpressAdapter.js";
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "packages/dtos/dist/user/types/CreateUserDto.js";

describe("UserController.ts", () => {
  let userController: UserController;

  let userServiceMock = {
    create: vi.fn(),
  } as unknown as UserService;

  beforeEach(() => {
    userController = new UserController(userServiceMock);
  });

  it("create function should work correctly", async () => {
    const httpReqMock = {
      body: { username: "username", email: "email", password: "password" },
    } as IHttpRequest<CreateUserRequestDto>;

    const createReturnValue: CreateUserResponseDto = {
      userDto: { id: "id", username: httpReqMock.body.username },
    };

    (userServiceMock.create as Mock).mockResolvedValue(createReturnValue);

    const result = await userController.create(httpReqMock);

    expect(userServiceMock.create).toHaveBeenCalledWith(httpReqMock.body);

    expect(result).toEqual({
      code: 201,
      errors: [],
      result: createReturnValue,
      success: true,
    });
  });
});
