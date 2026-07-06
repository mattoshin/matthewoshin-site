import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount everything between tests so DOM state never bleeds across files.
// Individual test files no longer need their own afterEach(cleanup).
afterEach(cleanup);
