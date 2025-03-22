import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import useLocalStorage from "./useLocalStorage.js";

describe("useLocalStorage.ts", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should set an item correctly", () => {
    const key = "isSideBarOpen";

    const { result } = renderHook(useLocalStorage);

    result.current.set(key, false);

    const data = window.localStorage.getItem(key);

    expect(data).toBe("false");
  });

  it("should clear all items correctly", () => {
    const key = "isSideBarOpen";

    const { result } = renderHook(useLocalStorage);

    result.current.set(key, false);

    window.localStorage.getItem(key);

    result.current.clear();

    expect(window.localStorage.getItem(key)).toBe(null);
  });

  it("should get an item correctly", () => {
    const key = "isSideBarOpen";

    const { result } = renderHook(useLocalStorage);

    result.current.set(key, false);

    const item = result.current.get(key);

    expect(item).toBe(false);
  });

  it("should remove an item correctly", () => {
    const key = "isSideBarOpen";

    const { result } = renderHook(useLocalStorage);

    result.current.set(key, false);

    result.current.remove(key);

    expect(window.localStorage.getItem(key)).toBeNull();
  });

  it("get should return null if there is no key", () => {
    const { result } = renderHook(useLocalStorage);
    //@ts-ignore
    const data = result.current.get("123");

    expect(data).toBe(null);
  });
});
