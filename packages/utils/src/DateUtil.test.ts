import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DateUtil from "./DateUtil.js";

describe("DateUtil.ts", () => {
  let dateUtil: DateUtil;
  const fixedTimestamp = 1680000000000;

  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(fixedTimestamp);

    dateUtil = new DateUtil();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return correct now date", () => {
    expect(dateUtil.now()).toBe(fixedTimestamp);
  });

  it("should return correct utc string", () => {
    expect(dateUtil.toUtcString(fixedTimestamp)).toBe(
      new Date(fixedTimestamp).toUTCString()
    );
  });

  it("should return correct iso string", () => {
    expect(dateUtil.toIsoString(fixedTimestamp)).toBe(
      new Date(fixedTimestamp).toISOString()
    );
  });

  it("should return correct locale date string", () => {
    expect(dateUtil.toLocaleDateString(fixedTimestamp)).toBe(
      new Date(fixedTimestamp).toLocaleDateString()
    );
  });

  it("getUtcOfNow should work", () => {
    const value = "Tue, 28 Mar 2023 10:40:00 GMT";

    expect(dateUtil.getUtcOfNow()).toBe(value);
  });

  it("getIsoOfNow should work", () => {
    const value = "2023-03-28T10:40:00.000Z";

    expect(dateUtil.getIsoOfNow()).toBe(value);
  });

  it("isDateInThePast should work", () => {
    const pastDate = "2022-03-28T10:40:00.000Z";
    const futureDate = "2099-03-28T10:40:00.000Z";

    expect(dateUtil.isDateInThePast(pastDate)).toBe(true);
    expect(dateUtil.isDateInThePast(futureDate)).toBe(false);
  });
});
