"use client";

import { Loader2 } from "lucide-react";
import { getToolLabel } from "@/lib/tool-labels";

interface ToolInvocationLabelProps {
  toolInvocation: {
    toolName: string;
    args: Record<string, any>;
    state: "result" | "streaming" | "call" | "partial-call";
    result?: any;
  };
}

export function ToolInvocationLabel({
  toolInvocation,
}: ToolInvocationLabelProps) {
  const isComplete =
    toolInvocation.state === "result" && toolInvocation.result;
  const label = getToolLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
