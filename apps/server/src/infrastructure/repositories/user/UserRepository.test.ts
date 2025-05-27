import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UserRepository from "./UserRepository.js";
import { userFixture } from "../../../__fixtures__/user/index.js";

describe("UserRepository.ts", () => {
  let userRepository: UserRepository;

  let queryDBMock: Mock;

  beforeEach(() => {
    queryDBMock = vi.fn();
    userRepository = new UserRepository(queryDBMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("findById should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.findById("id");

    expect(queryDBMock).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id=$1",
      ["id"]
    );

    expect(result).toEqual(userFixture);
  });

  it("findByUsername should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.findByUsername("username");

    expect(queryDBMock).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE username=$1",
      ["username"]
    );

    expect(result).toEqual(userFixture);
  });

  it("findByEmail should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.findByEmail("hashed_email");

    expect(queryDBMock).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE hashed_email=$1",
      ["hashed_email"]
    );

    expect(result).toEqual(userFixture);
  });

  it("create should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.create(userFixture);

    expect(queryDBMock).toHaveBeenCalledWith(
      "INSERT INTO users (id, username, encrypted_email, hashed_email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        userFixture.id,
        userFixture.username,
        userFixture.encrypted_email,
        userFixture.hashed_email,
        userFixture.password,
        userFixture.created_at,
      ]
    );

    expect(result).toEqual(userFixture);
  });

  it("update should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.update(userFixture);

    expect(queryDBMock).toHaveBeenCalledWith(
      "UPDATE users SET username = $1, encrypted_email = $2, hashed_email = $3, password = $4, is_verified=$5 WHERE users.id = $6 RETURNING *",
      [
        userFixture.username,
        userFixture.encrypted_email,
        userFixture.hashed_email,
        userFixture.password,
        `${userFixture.is_verified}`,
        userFixture.id,
      ]
    );

    expect(result).toEqual(userFixture);
  });

  it("update should work correctly", async () => {
    queryDBMock.mockResolvedValue([userFixture]);

    const result = await userRepository.deleteById("id");

    expect(queryDBMock).toHaveBeenCalledWith(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      ["id"]
    );

    expect(result).toEqual(userFixture);
  });

  it("user repository functions should use transaction query if option is set", async () => {
    const transactionQueryMock = vi.fn().mockResolvedValue(["user"]);

    queryDBMock.mockResolvedValue([userFixture]);

    await userRepository.create(userFixture, {
      transactionQuery: transactionQueryMock,
    });

    expect(transactionQueryMock).toHaveBeenCalled();
  });
});
