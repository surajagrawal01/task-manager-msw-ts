/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: false,
                tsconfig: {
                    jsx: "react-jsx",
                    esModuleInterop: true,
                    module: "commonjs",
                    moduleResolution: "node",
                    target: "ES2020",
                },
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    collectCoverageFrom: [
        "src/feature/auth/**/*.{ts,tsx}",
        "src/feature/tasks/**/*.{ts,tsx}",
        "!**/*.type.ts",
        "!**/*.test.{ts,tsx}",
        "!**/tests/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
};