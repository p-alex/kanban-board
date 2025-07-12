import { UserDto } from "@kanban/dtos/UserDtoTypes";
import { IUser } from "../domain/IUser.js";

function dtoToUser(userDto: UserDto): IUser {
  return {
    id: userDto.id,
    username: userDto.username,
  };
}

export type DtoToUser = typeof dtoToUser;

export default dtoToUser;
