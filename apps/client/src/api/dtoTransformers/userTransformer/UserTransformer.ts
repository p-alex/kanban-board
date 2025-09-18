import { UserDto } from "@kanban/dtos/UserDtoTypes";
import { IUser } from "../../domain/IUser";

class UserTransformer {
  static dtoToUser = (userDto: UserDto): IUser => {
    return {
      id: userDto.id,
      username: userDto.username,
    };
  };
}

export default UserTransformer;
