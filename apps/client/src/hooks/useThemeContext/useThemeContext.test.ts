import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useThemeContext from "./index.js";
import { ThemeContextValue } from "../../context/ThemeContext/Theme.context.js";

describe("useThemeContext.ts", () => {
  it("should return ThemeContext", () => {
    const { result } = renderHook(useThemeContext);

    const context = result.current as ThemeContextValue;

    expect(context.isDarkMode).toBe(false);
    expect(context.toggleTheme).toBeInstanceOf(Function);
  });
});
