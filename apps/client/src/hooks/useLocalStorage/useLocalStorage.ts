type LocalStorageKey = "isSideBarOpen" | "isDarkMode";

function useLocalStorage() {
  const get = <TResult>(key: LocalStorageKey): TResult | null => {
    const data = window.localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as TResult;
  };

  const set = <TData>(key: LocalStorageKey, data: TData) => {
    window.localStorage.setItem(key, JSON.stringify(data));
  };

  const remove = (key: LocalStorageKey) => {
    window.localStorage.removeItem(key);
  };

  const clear = () => {
    window.localStorage.clear();
  };

  return { get, set, remove, clear };
}

export type UseLocalStorage = typeof useLocalStorage;

export type LocalStorage = ReturnType<typeof useLocalStorage>;

export default useLocalStorage;
