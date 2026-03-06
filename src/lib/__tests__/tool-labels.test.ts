import { test, expect } from "vitest";
import { getToolLabel } from "../tool-labels";

// --- str_replace_editor ---

test("create: complete", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/App.jsx" },
      state: "result",
    })
  ).toBe("Created App.jsx");
});

test("create: in progress", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/App.jsx" },
      state: "call",
    })
  ).toBe("Creating App.jsx");
});

test("str_replace: complete", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "str_replace", path: "/components/Button.jsx" },
      state: "result",
    })
  ).toBe("Edited Button.jsx");
});

test("str_replace: streaming", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "str_replace", path: "/components/Button.jsx" },
      state: "streaming",
    })
  ).toBe("Editing Button.jsx");
});

test("insert: complete", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "insert", path: "/index.ts" },
      state: "result",
    })
  ).toBe("Inserted into index.ts");
});

test("insert: partial-call", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "insert", path: "/index.ts" },
      state: "partial-call",
    })
  ).toBe("Inserting into index.ts");
});

test("view: complete", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "view", path: "/README.md" },
      state: "result",
    })
  ).toBe("Read README.md");
});

test("view: in progress", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "view", path: "/README.md" },
      state: "call",
    })
  ).toBe("Reading README.md");
});

// --- file_manager ---

test("rename: complete shows new filename", () => {
  expect(
    getToolLabel({
      toolName: "file_manager",
      args: { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
      state: "result",
    })
  ).toBe("Renamed to new.tsx");
});

test("rename: in progress shows original filename", () => {
  expect(
    getToolLabel({
      toolName: "file_manager",
      args: { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
      state: "call",
    })
  ).toBe("Renaming old.tsx");
});

test("delete: complete", () => {
  expect(
    getToolLabel({
      toolName: "file_manager",
      args: { command: "delete", path: "/temp.js" },
      state: "result",
    })
  ).toBe("Deleted temp.js");
});

test("delete: in progress", () => {
  expect(
    getToolLabel({
      toolName: "file_manager",
      args: { command: "delete", path: "/temp.js" },
      state: "call",
    })
  ).toBe("Deleting temp.js");
});

// --- Edge cases ---

test("nested paths show only filename", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/src/components/ui/Button.tsx" },
      state: "result",
    })
  ).toBe("Created Button.tsx");
});

test("missing args falls back to generic label", () => {
  expect(
    getToolLabel({
      toolName: "str_replace_editor",
      args: {},
      state: "result",
    })
  ).toBe("Modified file");
});

test("unknown tool falls back to raw toolName", () => {
  expect(
    getToolLabel({
      toolName: "some_future_tool",
      args: { foo: "bar" },
      state: "result",
    })
  ).toBe("some_future_tool");
});

test("all four states map correctly", () => {
  const base = {
    toolName: "str_replace_editor",
    args: { command: "create", path: "/x.ts" },
  };
  expect(getToolLabel({ ...base, state: "result" })).toBe("Created x.ts");
  expect(getToolLabel({ ...base, state: "call" })).toBe("Creating x.ts");
  expect(getToolLabel({ ...base, state: "streaming" })).toBe("Creating x.ts");
  expect(getToolLabel({ ...base, state: "partial-call" })).toBe(
    "Creating x.ts"
  );
});
