interface ITime {
  milisecond: number;
  second: number;
  minute: number;
  hour: number;
  day: number;
  month: number;
  year: number;
}

type TimeType =
  | "milisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year";

class TimeConverter {
  private readonly _inMs: ITime;

  constructor() {
    this._inMs = {
      milisecond: 1,
      second: 1 * 1000,
      minute: 1 * 60 * 1000,
      hour: 1 * 60 * 60 * 1000,
      day: 1 * 24 * 60 * 60 * 1000,
      month: 1 * 30 * 24 * 60 * 60 * 1000,
      year: 1 * 12 * 30 * 24 * 60 * 60 * 1000,
    };
  }

  toMs(number: number, type: TimeType) {
    return number * this._inMs[type];
  }

  toSeconds(number: number, type: TimeType) {
    return Math.floor(number * (this._inMs[type] / this._inMs["second"]));
  }
}

export default TimeConverter;
