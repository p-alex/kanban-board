import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  Mocked,
  vi,
} from "vitest";
import { CreateUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import UserRepository from "../../../infrastructure/repositories/user/UserRepository.js";
import UserFactory from "../../../domain/user/UserFactory.js";
import UserService from "./UserService.js";
import { userFixture } from "../../../__fixtures__/user/index.js";
import { verificationCodeFixture } from "../../../__fixtures__/verificationCode/index.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import VerificationCodeFactory from "../../../domain/verificationCode/VerificationCodeFactory.js";
import VerificationCodeRepository from "../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import TransactionManager from "../../../db/TransactionManager/TransactionManager.js";

describe("UserService.ts", () => {
  const testUserData: CreateUserRequestDto = {
    username: "username",
    email: "email",
    password: "password",
  };

  const mockRun = vi.fn();

  const transactionManagerMock = {
    run: mockRun,
  } as unknown as Mocked<TransactionManager>;

  const userRepostoryMock = {
    findById: vi.fn(),
    findByUsername: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  } as unknown as Mocked<UserRepository>;

  const verificationCodeRepositoryMock = {
    create: vi.fn(),
    findByCode: vi.fn(),
    deleteByCode: vi.fn(),
  } as unknown as Mocked<VerificationCodeRepository>;

  const userFactoryMock = {
    create: vi.fn().mockReturnValue(userFixture),
  } as unknown as Mocked<UserFactory>;

  const verificationCodeFactoryMock = {
    create: vi.fn().mockReturnValue(verificationCodeFixture),
  } as unknown as Mocked<VerificationCodeFactory>;

  const sendVerificationEmailMock = vi.fn();

  const cryptoUtilMock = {
    generateCode: vi.fn().mockReturnValue("12345678"),
    sha256: vi.fn().mockImplementation(() => "sha256"),
  } as unknown as Mocked<CryptoUtil>;

  const dateUtilMock = {
    isDateInThePast: vi.fn(),
  } as unknown as Mocked<DateUtil>;

  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(
      transactionManagerMock,
      userRepostoryMock,
      verificationCodeRepositoryMock,
      userFactoryMock,
      verificationCodeFactoryMock,
      sendVerificationEmailMock,
      cryptoUtilMock,
      dateUtilMock
    );
  });

  describe("create", () => {
    it("should handle successfull user creation correctly", async () => {
      mockRun.mockImplementation(async (workFn) => {
        const fakeQuery = {}; // Simulate query object
        return await workFn(fakeQuery);
      });

      userRepostoryMock.findByUsername.mockResolvedValue(undefined);
      userRepostoryMock.findByEmail.mockResolvedValue(undefined);
      userRepostoryMock.create.mockResolvedValue(userFixture);

      const userData: CreateUserRequestDto = {
        username: "username",
        email: "email",
        password: "password",
      };

      const result = await userService.create(userData);

      expect(userRepostoryMock.findByUsername).toHaveBeenCalledWith(
        userData.username,
        { transactionQuery: {} }
      );
      expect(userRepostoryMock.findByEmail).toHaveBeenCalledWith("sha256", {
        transactionQuery: {},
      });
      expect(userFactoryMock.create).toHaveBeenCalledWith(userData);

      expect(cryptoUtilMock.generateCode).toHaveBeenCalled();

      expect(sendVerificationEmailMock).toHaveBeenCalledWith(
        "12345678",
        "email"
      );

      expect(result).toEqual({
        userDto: {
          id: userFixture.id,
          username: userFixture.username,
        },
      });
    });

    it("should handle duplicate username correctly", async () => {
      mockRun.mockImplementation(async (workFn) => {
        const fakeQuery = {}; // Simulate query object
        return await workFn({ query: fakeQuery });
      });

      userRepostoryMock.findByUsername.mockResolvedValue(userFixture);

      await expect(userService.create(testUserData)).rejects.toThrow(
        "A user with that username already exists"
      );
    });

    it("should handle duplicate email correctly", async () => {
      mockRun.mockImplementation(async (workFn) => {
        const fakeQuery = {}; // Simulate query object
        return await workFn({ query: fakeQuery });
      });

      userRepostoryMock.findByUsername.mockResolvedValue(undefined);
      userRepostoryMock.findByEmail.mockResolvedValue(userFixture);

      await expect(userService.create(testUserData)).rejects.toThrow(
        "A user with that email already exists"
      );
    });
  });

  describe("verifyEmail", () => {
    it("should handle situation when verification is not found in the database", async () => {
      mockRun.mockImplementation(async (workFn) => {
        return await workFn({ query: {} });
      });

      verificationCodeRepositoryMock.findByCode.mockResolvedValue(undefined);

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "Verification code does not exist"
      );
    });

    it("should handle situation when verification is not found in the database", async () => {
      mockRun.mockImplementation(async (workFn) => {
        return await workFn({ query: {} });
      });

      verificationCodeRepositoryMock.findByCode.mockResolvedValue({
        ...verificationCodeFixture,
        // @ts-ignore
        type: "other",
      });

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "Invalid verification code"
      );
    });

    it("should handle situation when verification is not found in the database", async () => {
      mockRun.mockImplementation(async (workFn) => {
        return await workFn({ query: {} });
      });

      dateUtilMock.isDateInThePast.mockReturnValue(true);

      verificationCodeRepositoryMock.findByCode.mockResolvedValue(
        verificationCodeFixture
      );

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "Verification code is expired"
      );

      expect(verificationCodeRepositoryMock.deleteByCode).toHaveBeenCalledWith(
        "sha256"
      );
    });

    it("should handle non-existant user associated to verification code", async () => {
      userRepostoryMock.findById.mockResolvedValue(undefined);

      dateUtilMock.isDateInThePast.mockReturnValue(false);

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "Verification code is associated to a user that does not exist"
      );
    });

    it("should handle user already verified", async () => {
      userRepostoryMock.findById.mockResolvedValue({
        ...userFixture,
        is_verified: true,
      });

      dateUtilMock.isDateInThePast.mockReturnValue(false);

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "User is already verified"
      );
    });

    it("should handle user already verified", async () => {
      userRepostoryMock.findById.mockResolvedValue({
        ...userFixture,
        is_verified: true,
      });

      dateUtilMock.isDateInThePast.mockReturnValue(false);

      await expect(userService.verifyEmail("1234")).rejects.toThrow(
        "User is already verified"
      );
    });

    it("should handle successfull email verification", async () => {
      verificationCodeRepositoryMock.findByCode.mockResolvedValue(
        verificationCodeFixture
      );

      dateUtilMock.isDateInThePast.mockReturnValue(false);

      userRepostoryMock.findById.mockResolvedValue({
        ...userFixture,
        is_verified: false,
      });

      const code = "1234";

      await userService.verifyEmail(code);

      expect(cryptoUtilMock.sha256).toHaveBeenCalledWith(code);

      expect(verificationCodeRepositoryMock.findByCode).toHaveBeenCalledWith(
        "sha256",
        { transactionQuery: { query: {} } }
      );

      expect(userRepostoryMock.findById).toHaveBeenCalledWith(
        verificationCodeFixture.user_id
      );

      expect(userRepostoryMock.update).toHaveBeenCalledWith(
        { ...userFixture, is_verified: true },
        { transactionQuery: { query: {} } }
      );

      expect(verificationCodeRepositoryMock.deleteByCode).toHaveBeenCalledWith(
        "sha256"
      );
    });
  });
});
