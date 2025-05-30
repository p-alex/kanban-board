import { UserDto } from "@kanban/dtos/UserDtoTypes";
import IUser from "./IUser.js";

function userToDto(user: IUser): UserDto {
  return {
    id: user.id,
    username: user.username,
  };
}

export type UserToDto = typeof userToDto;

export default userToDto;
