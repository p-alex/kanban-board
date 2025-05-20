import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  Mocked,
  vi,
} from "vitest";
import UserRepository from "../../infrastructure/repositories/user/UserRepository.js";
import UserFactory from "../../domain/user/UserFactory.js";
import IUser from "apps/server/dist/domain/IUser.js";
import UserService from "./UserService.js";
import { CreateUserRequestDto } from "packages/dtos/dist/user/types/CreateUserDto.js";

describe("UserService.ts", () => {
  const testUser: IUser = {
    id: "id",
    username: "username",
    email: "email",
    password: "password",
    created_at: "created_at",
  };

  const testUserData: CreateUserRequestDto = {
    username: "username",
    email: "email",
    password: "password",
  };

  const userRepostoryMock = {
    findByUsername: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
  } as unknown as Mocked<UserRepository>;

  const userFactoryMock = {
    create: vi.fn().mockReturnValue(testUser),
  } as unknown as Mocked<UserFactory>;

  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(userRepostoryMock, userFactoryMock);
    vi.resetAllMocks();
  });

  it("should handle successfull user creation correctly", async () => {
    userRepostoryMock.findByUsername.mockResolvedValue(undefined);
    userRepostoryMock.findByEmail.mockResolvedValue(undefined);
    userRepostoryMock.create.mockResolvedValue(testUser);

    const userData: CreateUserRequestDto = {
      username: "username",
      email: "email",
      password: "password",
    };

    const result = await userService.create(userData);

    expect(userRepostoryMock.findByUsername).toHaveBeenCalledWith(
      userData.username
    );
    expect(userRepostoryMock.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(userFactoryMock.create).toHaveBeenCalledWith(userData);

    expect(result).toEqual({
      userDto: {
        id: testUser.id,
        username: testUser.username,
      },
    });
  });

  it("should handle duplicate username correctly", async () => {
    userRepostoryMock.findByUsername.mockResolvedValue(testUser);

    await expect(userService.create(testUserData)).rejects.toThrow(
      "A user with that username already exists"
    );
  });

  it("should handle duplicate email correctly", async () => {
    userRepostoryMock.findByUsername.mockResolvedValue(undefined);
    userRepostoryMock.findByEmail.mockResolvedValue(testUser);

    await expect(userService.create(testUserData)).rejects.toThrow(
      "A user with that email already exists"
    );
  });
});
