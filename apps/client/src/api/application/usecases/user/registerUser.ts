import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { IUser } from "../../../domain/User.js";
import { httpClient } from "../../../../utils/HttpClient/index.js";
import createResponse from "../../../createResponse.js";
import userTransformer from "./userTransformer.js";
import { RegisterFormData } from "../../../../components/Forms/RegisterForm/RegisterFormValidation.js";
import { Response } from "../index.js";

async function registerUser(
  data: RegisterFormData,
  accessToken: string
): Promise<Response<{ user: IUser }>> {
  const body: CreateUserRequestDto = {
    email: data.email,
    password: data.password,
    username: data.username,
  };

  const result: ServerResponseDto<CreateUserResponseDto> =
    await httpClient.mutate("/users", "POST", body, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });

  return createResponse<{ user: IUser }>({
    code: result.code,
    errors: result.errors,
    result: { user: userTransformer.toEntity(result.result.userDto) },
    success: result.success,
  });
}

export type RegisterUserUsecase = typeof registerUser;

export default registerUser;
