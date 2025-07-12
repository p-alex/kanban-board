import * as jose from "jose";

class JwtUtil {
  private readonly _textEncoder: TextEncoder;

  constructor() {
    this._textEncoder = new TextEncoder();
  }

  async sign<TPayload extends jose.JWTPayload>(
    payload: TPayload,
    secret: string,
    expiresAtInSec: number
  ) {
    const joseToken = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresAtInSec)
      .sign(this._textEncoder.encode(secret));

    return joseToken;
  }

  async verify<TPayload>(token: string, secret: string) {
    const signSecret = this._textEncoder.encode(secret);

    const result = await jose.jwtVerify(token, signSecret);

    const josePayload = result.payload as TPayload;

    return josePayload;
  }
}

export default JwtUtil;
