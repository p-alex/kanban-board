import { CreateUserRequestDto, UserDto } from "@kanban/dtos/UserDtoTypes";
import IUser from "../../domain/user/IUser.js";
import UserRepository from "../../infrastructure/repositories/user/UserRepository.js";
import UserFactory from "../../domain/user/UserFactory.js";

class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userFactory: UserFactory
  ) {}

  create = async (
    userData: CreateUserRequestDto
  ): Promise<{ userDto: UserDto }> => {
    const userWithUsername = await this._userRepository.findByUsername(
      userData.username
    );

    if (userWithUsername)
      throw new Error("A user with that username already exists");

    const userWithEmail = await this._userRepository.findByEmail(
      userData.email
    );

    if (userWithEmail) throw new Error("A user with that email already exists");

    const newUser = await this._userFactory.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });

    const insertedUser = await this._userRepository.create(newUser);

    return { userDto: this._fromUserToDto(insertedUser) };
  };

  private _fromUserToDto(user: IUser): UserDto {
    return {
      id: user.id,
      username: user.username,
    };
  }
}

export default UserService;
