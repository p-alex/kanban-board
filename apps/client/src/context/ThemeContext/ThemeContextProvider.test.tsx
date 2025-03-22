import { render, screen } from "@testing-library/react";
import ThemeContextProvider from "./ThemeContextProvider";
import ThemeContext from "./ThemeContext";
import userEvent from "@testing-library/user-event";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage";

describe("ThemeContextProvider.tsx", () => {
  let localStorageMock: LocalStorage;

  beforeEach(() => {
    window.localStorage.clear();
    localStorageMock = {
      get: vi.fn(),
      set: vi.fn(),
    } as unknown as LocalStorage;
  });

  it("provides default theme state if isDarkMode key is not present in local storage", () => {
    let contextValue;

    localStorageMock.get = vi.fn().mockReturnValue(null);

    render(
      <ThemeContextProvider localStorage={localStorageMock}>
        <ThemeContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeContextProvider>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue!.isDarkMode).toBe(false);
  });

  it("should add isDarkMode key to localstorage if it is not already there and default it to false", () => {
    expect(window.localStorage.getItem("isDarkMode")).toBeNull();

    localStorageMock.get = vi.fn().mockReturnValue(null);

    render(
      <ThemeContextProvider localStorage={localStorageMock}>
        <ThemeContext.Consumer>
          {() => {
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeContextProvider>
    );

    expect(localStorageMock.set).toHaveBeenCalledWith("isDarkMode", false);
  });

  it("toggle theme state correctly", async () => {
    let contextValue;

    render(
      <ThemeContextProvider localStorage={localStorageMock}>
        <ThemeContext.Consumer>
          {(value) => {
            contextValue = value;
            return <button onClick={value.toggleTheme}></button>;
          }}
        </ThemeContext.Consumer>
      </ThemeContextProvider>
    );

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(contextValue!.isDarkMode).toBe(true);
  });
});
