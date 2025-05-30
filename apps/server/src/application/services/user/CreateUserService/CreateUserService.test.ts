import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import CheckIfUsernameIsUnique from "../../../usecases/user/CheckIfUsernameIsUnique/CheckIfUsernameIsUnique.js";
import CheckIfEmailIsUnique from "../../../usecases/user/CheckIfEmailIsUnique/CheckIfEmailIsUnique.js";
import CreateUserUsecase from "../../../usecases/user/CreateUser/CreateUserUsecase.js";
import CreateVerificationCodeUsecase from "../../../usecases/verificationCode/CreateVerificationCode/CreateVerificationCodeUsecase.js";
import { UserToDto } from "../../../../domain/user/userToDto.js";
import CreateUserService from "./CreateUserService.js";
import SendAccountVerificationEmailUsecase from "../../../usecases/email/SendAccountVerificationEmailUsecase.js";
import { UserDto } from "@kanban/dtos/UserDtoTypes";
import { userFixture } from "../../../../__fixtures__/user/index.js";

describe("CreateUserService.ts", () => {
  let transactionManagerMock: Mocked<TransactionManager>;

  const mockRun = vi.fn();

  let checkIfUsernameIsUniqueMock: Mocked<CheckIfUsernameIsUnique>;

  let checkIfEmailIsUniqueMock: Mocked<CheckIfEmailIsUnique>;

  let createUserMock: Mocked<CreateUserUsecase>;

  let createVerificationCodeMock: Mocked<CreateVerificationCodeUsecase>;

  let sendAccountVerificationEmailMock: Mocked<SendAccountVerificationEmailUsecase>;

  let userToDto: Mocked<UserToDto>;

  let createUserService: CreateUserService;

  beforeEach(() => {
    transactionManagerMock = {
      run: mockRun,
    } as unknown as Mocked<TransactionManager>;

    checkIfUsernameIsUniqueMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CheckIfUsernameIsUnique>;

    checkIfEmailIsUniqueMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CheckIfEmailIsUnique>;

    createUserMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateUserUsecase>;

    createVerificationCodeMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateVerificationCodeUsecase>;

    sendAccountVerificationEmailMock = {
      execute: vi.fn(),
    } as unknown as Mocked<SendAccountVerificationEmailUsecase>;

    userToDto = vi.fn().mockReturnValue({
      id: userFixture.id,
      username: userFixture.username,
    } as UserDto);

    createUserService = new CreateUserService(
      transactionManagerMock,
      checkIfUsernameIsUniqueMock,
      checkIfEmailIsUniqueMock,
      createUserMock,
      createVerificationCodeMock,
      sendAccountVerificationEmailMock,
      userToDto
    );
  });

  it("should create a user correctly", async () => {
    const userData = {
      username: userFixture.username,
      email: "email",
      password: userFixture.password,
    };

    mockRun.mockImplementation(async (workFn) => {
      const fakeQuery = {};
      return await workFn(fakeQuery);
    });

    createUserMock.execute.mockResolvedValue(userFixture);

    createVerificationCodeMock.execute.mockResolvedValue("123");

    const result = await createUserService.execute(userData);

    expect(checkIfUsernameIsUniqueMock.execute).toHaveBeenCalledWith(
      userData.username,
      {}
    );

    expect(checkIfEmailIsUniqueMock.execute).toHaveBeenCalledWith(
      userData.email,
      {}
    );

    expect(createUserMock.execute).toHaveBeenCalledWith(userData, {});

    expect(sendAccountVerificationEmailMock.execute).toHaveBeenCalledWith(
      "123",
      userData.email
    );

    expect(userToDto).toHaveBeenCalledWith(userFixture);

    expect(result).toEqual({
      userDto: { id: userFixture.id, username: userFixture.username },
    });
  });
});
