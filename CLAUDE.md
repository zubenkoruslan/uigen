# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language, Claude AI generates the code via streaming tool calls, and a virtual file system + iframe preview renders results in real-time.

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations
npm run dev            # Dev server with Turbopack (http://localhost:3000)
npm run build          # Production build
npm run lint           # ESLint
npm test               # Vitest (watch mode)
npx vitest run         # Vitest single run
npx vitest run src/components/chat  # Run tests in a specific directory
npm run db:reset       # Reset SQLite database
```

## Environment

- `ANTHROPIC_API_KEY` in `.env` (optional — runs with mock provider if absent)
- `JWT_SECRET` defaults to `"development-secret-key"` in dev
- SQLite database at `prisma/dev.db`

## Architecture

### Core Flow

```
User message → ChatProvider (useChat from Vercel AI SDK)
  → POST /api/chat (streaming response)
  → Claude with tool-calling (str_replace_editor, file_manager)
  → VirtualFileSystem updates (server-side)
  → Tool call results forwarded to FileSystemContext (client-side)
  → Preview iframe re-renders via Babel standalone JSX→JS transform
```

### Key Architectural Decisions

- **Virtual file system**: All generated code lives in an in-memory `Map<string, string>` (`VirtualFileSystem` class). No files written to disk. Serialized to JSON for persistence.
- **Preview rendering**: Babel standalone transforms JSX to JS in the browser. Files are served as blob URLs via an import map inside a sandboxed iframe. Tailwind CSS is loaded from CDN in the iframe.
- **AI tools**: Two tools are exposed to Claude — `str_replace_editor` (create/edit/insert in files) and `file_manager` (rename/delete). Tool calls are processed both server-side (for persistence) and client-side (for UI updates) via `handleToolCall` in `FileSystemContext`.
- **Dual provider**: `src/lib/provider.ts` returns either Claude (via `@ai-sdk/anthropic`) or a mock provider that returns hardcoded component demos. The mock activates when `ANTHROPIC_API_KEY` is not set.
- **State management**: React Context only — `FileSystemContext` (file operations + refresh triggers) and `ChatContext` (wraps Vercel AI SDK's `useChat`).
- **Auth**: JWT tokens via `jose`, stored in httpOnly cookies. Server Actions for signUp/signIn/signOut. Anonymous users can use the app but can't persist projects.

### Key Files

| Path | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Main AI streaming endpoint, tool definitions, project persistence |
| `src/lib/file-system.ts` | `VirtualFileSystem` class — create, read, update, delete, serialize/deserialize |
| `src/lib/contexts/file-system-context.tsx` | Client-side file state + tool call handler |
| `src/lib/contexts/chat-context.tsx` | Chat state wrapping `useChat` from AI SDK |
| `src/lib/transform/jsx-transformer.ts` | Babel JSX→JS transform + preview HTML generation |
| `src/lib/prompts/generation.tsx` | System prompt controlling Claude's generation behavior |
| `src/lib/tools/str-replace.ts` | str_replace_editor tool definition |
| `src/lib/tools/file-manager.ts` | file_manager tool definition |
| `src/app/main-content.tsx` | Main UI layout with resizable panels (chat / editor / preview) |
| `prisma/schema.prisma` | Database schema (User, Project models) |

### Conventions

- Path alias: `@/*` maps to `./src/*`
- UI components use shadcn/ui pattern in `src/components/ui/`
- Tests live in `__tests__/` folders next to their source files
- Generated components always start with `/App.jsx` as the entry point and use `@/` import alias within the virtual FS
- All non-library imports in generated code use `@/` prefix (e.g., `@/components/Calculator`)
- Use comments sparingly — only comment complex code
- The database schema is defined in `prisma/schema.prisma` — reference it anytime you need to understand stored data structure
