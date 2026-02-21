import { useAuthStore } from "../auth.store";

const TOKEN_KEY = "token";

describe("Auth Store", () => {
    let localStorageMock: Record<string, string>;

    beforeEach(() => {
        localStorageMock = {};
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: (key: string) => localStorageMock[key] ?? null,
                setItem: (key: string, value: string) => {
                    localStorageMock[key] = value;
                },
                removeItem: (key: string) => {
                    delete localStorageMock[key];
                },
                clear: () => {
                    localStorageMock = {};
                },
                length: 0,
                key: () => null,
            },
            writable: true,
        });
        useAuthStore.setState({ token: null });
    });

    it("login(token) sets token in store and localStorage", () => {
        useAuthStore.getState().login("my-jwt-token");
        expect(useAuthStore.getState().token).toBe("my-jwt-token");
        expect(localStorage.getItem(TOKEN_KEY)).toBe("my-jwt-token");
    });

    it("logout() clears token from store and localStorage", () => {
        useAuthStore.setState({ token: "abc" });
        localStorageMock[TOKEN_KEY] = "abc";
        useAuthStore.getState().logout();
        expect(useAuthStore.getState().token).toBeNull();
        expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
});