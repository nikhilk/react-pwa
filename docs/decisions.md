# Decisions

Decisions made during development with captured rationale, tradeoffs, and
steps to revisit.

## React vs Preact

**Decision**: Stay with React.

**Context**: React DOM contributes ~173 KB (minified) to the bundle.
Preact with `preact/compat` is ~4 KB — a potential saving of ~170 KB.

**What Preact supports**: Standard hooks (`useState`, `useEffect`,
`useContext`, `useMemo`, `useRef`, etc.), `createContext`, `forwardRef`,
`React.lazy`, basic `Suspense` for code splitting. Most third-party
component libraries work through `preact/compat`.

**What Preact does not support**:

- React 19 APIs: `use()`, `useFormStatus`, `useOptimistic`, Actions,
  server components
- Concurrent rendering: `useTransition`, `useDeferredValue`, Suspense
  for data fetching
- Synthetic event system (Preact uses native DOM events — rarely an
  issue, but edge cases exist)
- Libraries that check `React.version` or depend on React internals

**Risk**: If a future dependency requires React 19 internals, it won't
work with Preact. The swap back to React is the same config change
described below.

**Steps to switch to Preact**:

1. Replace dependencies:
   ```sh
   npm uninstall react react-dom @types/react @types/react-dom
   npm install preact
   ```
2. Add aliases to `Bun.build()` in `tools/build.ts`:
   ```ts
   alias: {
     'react': 'preact/compat',
     'react-dom': 'preact/compat',
     'react/jsx-runtime': 'preact/jsx-runtime',
   }
   ```
3. Update `tsconfig.json` paths:
   ```json
   "paths": {
     "react": ["./node_modules/preact/compat"],
     "react-dom": ["./node_modules/preact/compat"]
   }
   ```
4. No source code changes needed — `preact/compat` is a drop-in.

**Expected saving**: ~170 KB from the production bundle.

## React Router vs custom hash router

**Decision**: Stay with React Router.

**Context**: React Router contributes ~40 KB (minified) to the bundle.
The app has two flat routes (Home, Settings) with no nested layouts,
route parameters, or programmatic navigation — simple enough for a
custom implementation.

**What a custom router needs**: Listen to `hashchange`, match the hash
to a component, render it. About 30 lines of code for flat routes.

**When React Router earns its keep**:

- Nested routes with shared layouts
- Route parameters (`/users/:id`)
- Programmatic navigation (redirects, guards)
- Scroll restoration
- Code splitting with lazy-loaded routes

**Steps to replace with a custom router**:

1. Remove dependency:
   ```sh
   npm uninstall react-router-dom
   ```
2. Create `src/utils/router.ts` with a `useHash()` hook that returns
   the current hash and re-renders on `hashchange`.
3. Replace `<HashRouter>`, `<Routes>`, `<Route>` in `App.tsx` with a
   switch on the hash value.
4. Replace `<NavLink>` in `Nav.tsx` with plain `<a href="#/...">` tags,
   adding active styling based on the current hash.

**Expected saving**: ~40 KB from the production bundle.
