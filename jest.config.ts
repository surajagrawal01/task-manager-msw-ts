/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",

    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },

    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.app.json",
        },
    },
};
