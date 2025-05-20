import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UserRepository from "./UserRepository.js";
import IUser from "apps/server/src/domain/user/IUser.js";

describe("UserRepository.ts", () => {
  let userRepository: UserRepository;

  let queryDBMock: Mock;

  const user: IUser = {
    id: "id",
    username: "username",
    password: "password",
    email: "email",
    created_at: "create_at",
  };

  beforeEach(() => {
    queryDBMock = vi.fn();
    userRepository = new UserRepository(queryDBMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("findByUsername should work correctly", async () => {
    queryDBMock.mockResolvedValue([user]);

    const result = await userRepository.findByUsername("username");

    expect(queryDBMock).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE username=$1",
      ["username"]
    );

    expect(result).toEqual(user);
  });

  it("findByEmail should work correctly", async () => {
    queryDBMock.mockResolvedValue([user]);

    const result = await userRepository.findByEmail("email");

    expect(queryDBMock).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE email=$1",
      ["email"]
    );

    expect(result).toEqual(user);
  });

  it("create should work correctly", async () => {
    queryDBMock.mockResolvedValue([user]);

    const result = await userRepository.create(user);

    expect(queryDBMock).toHaveBeenCalledWith(
      "INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user.id, user.username, user.email, user.password, user.created_at]
    );

    expect(result).toEqual(user);
  });
});
