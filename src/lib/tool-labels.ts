interface ToolInvocationInfo {
  toolName: string;
  args: Record<string, any>;
  state: "result" | "streaming" | "call" | "partial-call";
}

function getFilename(path: string): string {
  if (!path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

export function getToolLabel(tool: ToolInvocationInfo): string {
  const isComplete = tool.state === "result";
  const args = tool.args || {};
  const filename = getFilename(args.path || "");

  if (tool.toolName === "str_replace_editor") {
    const command = args.command as string | undefined;

    switch (command) {
      case "create":
        return isComplete ? `Created ${filename}` : `Creating ${filename}`;
      case "str_replace":
        return isComplete ? `Edited ${filename}` : `Editing ${filename}`;
      case "insert":
        return isComplete
          ? `Inserted into ${filename}`
          : `Inserting into ${filename}`;
      case "view":
        return isComplete ? `Read ${filename}` : `Reading ${filename}`;
      default:
        return isComplete
          ? `Modified ${filename || "file"}`
          : `Modifying ${filename || "file"}`;
    }
  }

  if (tool.toolName === "file_manager") {
    const command = args.command as string | undefined;

    if (command === "rename") {
      const newFilename = getFilename(args.new_path || "");
      return isComplete
        ? `Renamed to ${newFilename || filename}`
        : `Renaming ${filename}`;
    }

    if (command === "delete") {
      return isComplete ? `Deleted ${filename}` : `Deleting ${filename}`;
    }

    return isComplete
      ? `Modified ${filename || "file"}`
      : `Modifying ${filename || "file"}`;
  }

  return tool.toolName;
}
