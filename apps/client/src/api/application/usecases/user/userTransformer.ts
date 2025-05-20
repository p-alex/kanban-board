import { IUser } from "../../../domain/User";
import { UserDto } from "@kanban/dtos/UserDtoTypes";

class UserTransformer {
  toDto(user: IUser): UserDto {
    return {
      id: user.id,
      username: user.username,
    };
  }

  toEntity(userDto: UserDto): IUser {
    return {
      id: userDto.id,
      username: userDto.username,
    };
  }
}

const userTransformer = new UserTransformer();

export default userTransformer;
