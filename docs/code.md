# Coding guidelines

## Formatting

- **String literals**: single quotes (`'foo'`, not `"foo"`)
- **Bracing style**: Stroustrup — opening brace on the same line as the
  statement, `else`/`catch`/`finally` on a new line after the closing brace:
  ```ts
  if (condition) {
    doSomething()
  }
  else {
    doOther()
  }
  ```
- **Braces are required**: always use braces for `if`, `else`, `catch`,
  `finally`, and loop bodies — even for single-line statements
- **Line length**: aim for 100 characters or fewer
- **Semicolons**: omit where possible (TypeScript/JSX)
- **Trailing commas**: use in multi-line lists and argument lists
- **Indentation**: 2 spaces

## Comments

- Default to no inline comments — let clear naming speak for routine logic
- Comment the *why* when a technique or workaround isn't immediately obvious
- Never comment the *what* — if the code needs that, rename instead
- No multi-line doc blocks

## Naming

Names should be clear at the point of use without reading surrounding code.
Prefer `darkTheme` over `dark`, `clickCount` over `count`, `updateSettings`
over `update`. Booleans should read as state: `animating`, not `animate`.
Keep names short but specific — one or two words that tell you *what it is*,
not just *what type it is*.

- **Variables and identifiers**: always `camelCase`
- **Types, components, and React contexts**: always `PascalCase` (React
  treats lowercase JSX tags as HTML elements)

## File organization

- One component per file
- File names match the export (`Home.tsx` exports `Home`)
- Group by role: `pages/` for route-level views, `components/` for reusable
  UI, root-level for app shell and state

## File headers

Every code file starts with a three-line header:

```ts
// filename.ts
// One-line description of what's in the file
//
```

The blank `//` line separates the header from the code below.

## Design

Extract code into its own module when it has a distinct responsibility —
not when it's merely long. A good extraction makes its consumer simpler to
read. Avoid creating abstractions for hypothetical reuse; extract when a
concern is genuinely separate. Three clear lines inline beat a one-line
call to a wrapper nobody remembers.

## TypeScript

- Prefer `type` over `interface` for object shapes, unless extending
- Use explicit return types only when the compiler can't infer or when the
  function is exported
- Prefer `const` over `let`; never use `var`
- Use `import type` for type-only imports
- Prefer namespace imports for external packages so the source is visible
  at every call site: e.g. `import * as React from 'react'`,
  `import * as fs from 'fs'`. Use named imports only for local project files
  where the relative path already makes the origin clear

## React

- Functional components only — no classes
- Named exports (`export function Home()`, not default exports)
- Keep components in `src/pages/` (routed views) or `src/components/`
  (shared UI)
- Colocate styles using Tailwind utility classes — no separate CSS files per
  component
- Use [Lucide](https://lucide.dev/) icons via `lucide-react`; import only
  what you need: `import { Sun, Moon } from 'lucide-react'`
- Use utility classes directly in JSX
- For long class strings, break across lines using string concatenation:
  ```tsx
  className={
    'px-4 py-2 rounded-lg'
    + ' bg-blue-600 hover:bg-blue-700'
    + ' text-white font-medium'
  }
  ```
- Use the `dark:` variant for dark mode styles
- Custom theme values go in `src/styles.css` under `@theme`
