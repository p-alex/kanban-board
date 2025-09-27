import { Request } from "express";
import { IAuthenticatedUser } from "../../middleware/AuthShield/index.js";

export type CustomRequest = Request & { auth_user?: IAuthenticatedUser };

export function httpRequestFactory(): IHttpRequest {
  return {
    body: {},
    params: {},
    query: {},
    client_ip: "ip",
    method: "get",
    url: "/url",
    cookies: {},
    accessToken: "",
    auth_user: null,
  };
}

export interface IHttpRequest<TBody = any, TParams = any, TQuery = any> {
  body: TBody;
  params: TParams;
  query: TQuery;
  client_ip: string;
  method: string;
  url: string;
  cookies: { [key: string]: string };
  accessToken: string;
  auth_user: IAuthenticatedUser | null;
}

export interface ICookie {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  path?: string;
  domain?: string;
  sameSite: "strict" | "none" | "lax";
  maxAgeInMs: number;
}

export interface IHandlerResponse<TResponseResult> {
  response: IHttpResponse<TResponseResult>;
  headers?: Record<string, string>;
  cookies?: ICookie[];
  authenticatedUser?: IAuthenticatedUser | null;
}

export interface IHttpResponse<TResult> {
  code: number;
  success: boolean;
  result: TResult;
  errors: string[];
}

export function cookieParser(cookie?: string) {
  if (!cookie) return {};

  return cookie.split("; ").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });
}

export type CookieParser = typeof cookieParser;
