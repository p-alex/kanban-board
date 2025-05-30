import { describe, expect, it } from "vitest";
import userToDto from "./userToDto.js";
import { userFixture } from "../../__fixtures__/user/index.js";

describe("userToDto.ts", () => {
  it("should create dto from user", () => {
    const result = userToDto(userFixture);

    expect(result).toEqual({
      id: userFixture.id,
      username: userFixture.username,
    });
  });
});
