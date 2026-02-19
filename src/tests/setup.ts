import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "./server";

global.TextEncoder = TextEncoder as never;
global.TextDecoder = TextDecoder as never;

// Start MSW before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after tests
afterAll(() => server.close());
