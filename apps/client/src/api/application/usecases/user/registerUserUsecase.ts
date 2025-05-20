import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { IUser } from "../../../domain/User.js";
import { Response } from "../index.js";
import { privateHttpClient } from "../../../../utils/HttpClient/index.js";
import createResponse from "../../../createResponse.js";
import userTransformer from "./userTransformer.js";
import { RegisterFormData } from "../../../../components/RegisterForm/RegisterFormValidation.js";

async function registerUserUsecase(
  data: RegisterFormData,
  accessToken: string
): Promise<Response<{ user: IUser }>> {
  const body: CreateUserRequestDto = {
    email: data.email,
    password: data.password,
    username: data.username,
  };

  const result: ServerResponseDto<CreateUserResponseDto> =
    await privateHttpClient.mutate("/users", "POST", body, {
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

export type RegisterUserUsecase = typeof registerUserUsecase;

export default registerUserUsecase;
