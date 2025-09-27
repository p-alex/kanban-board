import { DateUtil, JwtUtil, TimeConverter } from "@kanban/utils";

class CreateAccessTokenUsecase {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _accessTokenSecret: string,
    private readonly _time: TimeConverter,
    private readonly _date: DateUtil
  ) {}

  execute = async (id: string) => {
    const issuedAt = this._time.toSeconds(this._date.now(), "milisecond");
    const expireAt = issuedAt + this._time.toSeconds(15, "minute");
    return await this._jwt.sign({ id }, this._accessTokenSecret, expireAt);
  };
}

export default CreateAccessTokenUsecase;
