import { describe, expect, it } from "vitest";
import UserTransformer from "./UserTransformer.js";
import { userDtoMock } from "../../../__fixtures__/user/index.js";
import { IUser } from "../../domain/IUser.js";

describe("UserTransformer.ts", () => {
  it("should transform from dto to user", () => {
    const result = UserTransformer.dtoToUser(userDtoMock);

    const expectedResult: IUser = {
      id: userDtoMock.id,
      username: userDtoMock.username,
    };

    expect(expectedResult).toEqual(result);
  });
});
