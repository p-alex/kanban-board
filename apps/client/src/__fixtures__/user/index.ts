import { UserDto } from "@kanban/dtos/UserDtoTypes";
import { IUser } from "../../api/domain/IUser";

export const userMock: IUser = {
  id: "id",
  username: "username",
};

export const userDtoMock: UserDto = {
  id: "id",
  username: "username",
};
