import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationLabel } from "../ToolInvocationLabel";

afterEach(() => {
  cleanup();
});

test("shows green dot and label for completed invocation", () => {
  const { container } = render(
    <ToolInvocationLabel
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created",
      }}
    />
  );

  expect(screen.getByText("Created App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows spinner and label for in-progress invocation", () => {
  const { container } = render(
    <ToolInvocationLabel
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows spinner when state is result but result is falsy", () => {
  const { container } = render(
    <ToolInvocationLabel
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: undefined,
      }}
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("renders file_manager delete label", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "delete", path: "/temp.js" },
        state: "streaming",
      }}
    />
  );

  expect(screen.getByText("Deleting temp.js")).toBeDefined();
});
