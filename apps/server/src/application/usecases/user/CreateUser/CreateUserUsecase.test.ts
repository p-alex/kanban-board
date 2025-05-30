import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import CreateUserUsecase from "./CreateUserUsecase.js";
import UserFactory from "../../../../domain/user/UserFactory.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import { userFixture } from "../../../../__fixtures__/user/index.js";

describe("CreateUserUsecase.ts", () => {
  let createUser: CreateUserUsecase;

  let userFactory: Mocked<UserFactory>;
  let userRepositoryMock: Mocked<UserRepository>;

  beforeEach(() => {
    userFactory = {
      create: vi.fn().mockResolvedValue(userFixture),
    } as unknown as Mocked<UserFactory>;

    userRepositoryMock = {
      create: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    createUser = new CreateUserUsecase(userFactory, userRepositoryMock);
  });

  it("should create a user correctly", async () => {
    const userData = {
      username: userFixture.username,
      email: "email",
      password: userFixture.password,
    };
    const queryDb = vi.fn();

    await createUser.execute(userData, queryDb);

    expect(userFactory.create).toHaveBeenCalledWith(userData);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(userFixture, {
      transactionQuery: queryDb,
    });
  });
});
