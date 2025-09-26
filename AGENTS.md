# Agent Guidelines for kode24-tui

## IMPORTANT

- Try to keep things in one function unless composable or reusable
- DO NOT do unnecessary destructuring of variables
- DO NOT use `else` statements unless necessary
- DO NOT use `try`/`catch` if it can be avoided
- AVOID `try`/`catch` where possible
- AVOID `else` statements
- AVOID using `any` type
- AVOID `let` statements
- PREFER single word variable names where possible
- Use as many bun apis as possible like Bun.file()

## Build/Test/Lint Commands

- **Run project**: `bun run index.ts` or `bun start`
- **Install deps**: `bun install`
- **Type check**: `bun run tsc --noEmit`
- No specific test/lint scripts configured - add if needed

## OpenTUI Documentation

- **Docs location**: <https://github.com/sst/opentui> - check `docs/` folder and `readme.md` in each package
- **When docs are insufficient**: Always examine source code at <https://github.com/sst/opentui/blob/main/packages/react/src/components/index.ts>
- **Examples**: Examples for React usage can be found at <https://github.com/sst/opentui/tree/main/packages/react/examples>
- **Component reference**: Use source code to understand available props, types, and usage patterns
- Additional info is avaialble in `TUI.MD`

## Code Style & Conventions

- **Runtime**: Bun with TypeScript (ES modules, `"type": "module"`)
- **Imports**: Use `import * as z from "zod"` for Zod, avoid default imports where possible
- **Types**: Export both Zod schemas and inferred types: `export const Schema = z.object({...}); export type Type = z.infer<typeof Schema>;`
- **Naming**: PascalCase for schemas/types (e.g., `TeAliasSchema`, `TeAlias`), camelCase for variables
- **Schema definitions**: Use descriptive enum values, handle optional fields with `.optional()`
- **File structure**: Schemas in `src/schemas/`, examples in `examples/`

## TypeScript Configuration

- Strict mode enabled with modern ES features
- `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noImplicitOverride` enforced
- JSX configured for React
- Bundler module resolution, no emit mode

## Error Handling

- Use Zod for runtime validation and type safety
- Prefer union types with `z.union()` for nullable fields
- Use `z.coerce.date()` for date parsing from strings
