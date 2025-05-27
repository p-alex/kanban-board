import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UserController from "./UserController.js";
import { IHttpRequest } from "../../adapter/ExpressAdapter.js";
import UserService from "../../../application/services/user/UserService.js";
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import { EmailVerificationRequestDto } from "@kanban/dtos/VerificationCodeDtoTypes";

describe("UserController.ts", () => {
  let userController: UserController;

  let userServiceMock = {
    create: vi.fn(),
    verifyEmail: vi.fn(),
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

  it("verifyEmail function should work correctly", async () => {
    const httpReqMock = {
      body: { verification_code: "code" },
    } as IHttpRequest<EmailVerificationRequestDto>;

    const result = await userController.verifyEmail(httpReqMock);

    expect(userServiceMock.verifyEmail).toHaveBeenCalledWith(
      httpReqMock.body.verification_code
    );

    expect(result).toEqual({
      code: 200,
      errors: [],
      result: null,
      success: true,
    });
  });
});
