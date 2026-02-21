# Task Management Application (Frontend)

A frontend-only task management application built with React and TypeScript. It simulates user authentication and task CRUD operations using a mocked API layer (MSW). This document covers how to run the project, how mocking works, project structure, and implemented features including error handling, loading states, and dark/light mode.

---

## Prerequisites

- **Node.js** 18+ (or 20+)
- npm (comes with Node)

---

## How to Run the Project Locally

1. **Install dependencies** (from the project root where `package.json` lives):

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

   The Task Management app is served at **http://localhost:5173** (Vite) or the port shown in the terminal.

3. **Login**: Use the predefined mock user:

   - **Username:** `test`
   - **Password:** `test123`

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Run tests** (with coverage):

   ```bash
   npm test
   npm test -- --coverage
   ```

6. **Lint**:

   ```bash
   npm run lint
   ```

### Before Submission

- Run `npm test -- --coverage` and ensure more than 90% coverage (fix any uncovered lines).
- Run `npm run lint` and fix all reported errors.

---

## Live Demo

- **URL:** https://task-manager-msw-ts.vercel.app

---

## How the Mocking Works

The app uses **Mock Service Worker (MSW)** to intercept network requests and return fake responses. No real backend is required.

### Setup

- **Browser (development):** In `src/main.tsx`, `enableMocking()` runs before the app mounts. In `DEV`, it starts the MSW worker from `src/mocks/browser.ts`, which uses the same handlers as in `src/mocks/handlers.ts`.
- **Tests:** `src/tests/setup.ts` configures the MSW Node server (`src/tests/server.ts`) so that tests use the same handlers without hitting the network.

### Mock Endpoints

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/login`        | Mock login. Accepts `username` / `password`; returns a fake JWT for `test` / `test123`. |
| GET    | `/tasks`        | Returns the list of tasks (from in-memory storage backed by `localStorage`). |
| POST   | `/tasks`        | Creates a new task (title, description, status); returns the created task. |
| PUT    | `/tasks/:id`    | Updates a task by id; returns the updated task. |
| DELETE | `/tasks/:id`    | Deletes a task by id; returns 200. |

### Persistence

- **Auth:** The fake JWT is stored in `localStorage` under the key used by `src/feature/auth/auth.store.ts`. It is read on load so the user stays "logged in" across reloads.
- **Tasks:** MSW handlers use `src/mocks/storage.ts`, which reads and writes tasks to `localStorage` under the key `msw-tasks`. Task list therefore persists across reloads.

---

## Project Structure and Libraries

### Directory Structure (under `src/`)

```
src/
├── app/
│   └── router.tsx           # React Router routes (login, protected dashboard)
├── feature/
│   ├── auth/
|       |── tests/           # test files
│   │   ├── pages/LoginPage.tsx
│   │   ├── ProtectedRoute.tsx
|       |── NotFoundPage.tsx
│   │   ├── auth.store.ts    # Zustand: token, login, logout
│   │   └── auth.type.ts
│   └── tasks/
|       |── tests/           # test files
│       ├── components/
│       │   ├── TaskModal.tsx # Create/Edit task form
│       │   ├── TaskRow.tsx
│       │   └── TaskTable.tsx
│       ├── page/DashboardPage.tsx
│       ├── tasks.api.ts     # API calls (GET/POST/PUT/DELETE /tasks)
│       ├── tasks.store.ts   # Zustand: tasks, loading, error, CRUD, clearError
│       └── tasks.type.ts
├── mocks/
│   ├── browser.ts           # MSW worker for browser
│   ├── handlers.ts          # MSW request handlers (login + tasks)
│   └── storage.ts           # localStorage read/write for tasks
├── shared/
│   ├── components/Tooltip.tsx
│   ├── layout/
│   │   ├── Header.tsx       # Logout + theme toggle
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── theme/
│       ├── theme.store.ts   # Zustand: theme (light/dark), setTheme, toggleTheme
│       └── ThemeSync.tsx    # Applies theme class to <html> for Tailwind dark mode
├── tests/
│   ├── server.ts            # MSW server for Jest
│   └── setup.ts             # Jest + MSW lifecycle
├── index.css                # Tailwind directives
└── main.tsx                 # enableMocking, initTheme, React render
```

### Tech Stack

| Area           | Choice              |
|----------------|---------------------|
| Framework      | React (Vite)         |
| Language       | TypeScript           |
| State          | Zustand (auth, tasks, theme) |
| Styling        | Tailwind CSS         |
| Mock API       | Mock Service Worker (MSW) |
| HTTP           | Fetch API            |
| Routing        | React Router         |
| Tests          | Jest + React Testing Library + MSW |

---

## Implemented Features

### Core Functionality

- **Login page** with mocked auth (username `test`, password `test123`); JWT stored in `localStorage`.
- **Dashboard** with list of tasks, search by title, and status filter.
- **Create/Edit task** via `TaskModal` (title, description, status).
- **Update/Delete** task actions from the task row; auth-protected dashboard and logout in the header.

### Error View

- The tasks store holds an `error` field (e.g. when `fetchTasks` fails).
- **Dashboard** shows an **error banner** when `error` is non-null:
  - Displays the error message.
  - **Retry** button calls `fetchTasks()` again (store clears `error` at the start of `fetchTasks`).
  - **Dismiss** button calls `clearError()` to hide the banner.
- Error is also cleared when the user changes the **search** or **status filter** (so changing filters dismisses the error state).

### Loading State

- The tasks store has a `loading` flag set during `fetchTasks`.
- **Dashboard** uses it to show a **loading skeleton** (animated placeholder rows) while tasks are loading, and the task table when loading is done.

### Dark / Light Mode

- **Theme store** (`src/shared/theme/theme.store.ts`): holds `theme` (`"light"` | `"dark"`), with `setTheme` and `toggleTheme`; preference is persisted in `localStorage` under the key `theme`.
- **ThemeSync** (`src/shared/theme/ThemeSync.tsx`): applies the theme to the document by adding/removing the `dark` class on `<html>` so Tailwind's `dark:` variants apply.
- **Initial load:** In `main.tsx`, `initTheme()` runs before the first render and sets the `dark` class from `localStorage` to avoid a flash of wrong theme.
- **Toggle:** In the **Header**, a **Dark / Light** button is shown next to **Logout** (when logged in). It toggles the theme and updates the UI everywhere (login page, dashboard, task table, modal, footer, etc.).
- **Tailwind:** All main UI components use `dark:` classes for backgrounds, borders, and text. For this to work, Tailwind must be configured with **`darkMode: 'class'`** (in `tailwind.config.js` or equivalent).

---

## Summary of Deliverables

- Login (mocked auth + JWT), dashboard, task CRUD, logout, protected routes.
- State: Zustand for auth, tasks, and theme.
- Mocking: MSW with POST `/login`, GET/POST/PUT/DELETE `/tasks`; persistence via `localStorage` for token and tasks.
- UI: Responsive layout, Tailwind, empty state ("No tasks available"), **error banner** with Retry/Dismiss, **loading skeleton**, and **dark/light mode** with a header toggle.
