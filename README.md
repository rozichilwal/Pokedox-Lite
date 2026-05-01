# 🔴 Pokédex Lite

A sleek, responsive Pokédex web application built with React and Vite. Browse all Pokémon, search by name, filter by type, mark your favourites, and dive into detailed stats — all powered by the free [PokéAPI](https://pokeapi.co/).



---

## ✨ Features

- 🔍 **Live Search** — Search Pokémon by name with debounced input (no API spam)
- 🎛️ **Type Filter** — Narrow results by any Pokémon type via dropdown
- 📄 **Pagination** — Browse 12 Pokémon per page across the full National Dex
- ❤️ **Favourites** — Heart any Pokémon; favourites persist across sessions via `localStorage`
- 📊 **Detail Modal** — Click a card to see height, weight, abilities, and colour-coded base stats
- ⚡ **Loading & Error States** — Graceful handling with spinner and user-friendly error messages
- 📱 **Fully Responsive** — Mobile-first grid layout (1 → 2 → 3 → 4 columns)

---

## 🛠️ Tech Stack

| Technology | Version | Why it was chosen |
|---|---|---|
| **React** | 19 | Industry-standard UI library; component model maps cleanly to Pokémon cards, modal, search, and pagination |
| **Vite** | 8 | Lightning-fast dev server and HMR; zero-config setup for modern React projects |
| **Tailwind CSS** | 4 (via `@tailwindcss/vite`) | Utility-first styling keeps component markup self-contained and avoids context-switching to CSS files |
| **PokéAPI** | v2 (REST) | Free, well-documented, no auth required — perfect for a frontend-only app |
| **localStorage** | Browser native | Zero-dependency persistence for the favourites list across page reloads |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18 — [Download](https://nodejs.org/)
- **npm** ≥ 9 (comes with Node.js)

Verify your versions:

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rozichilwal/Pokedox-Lite
   cd Pokedox-Lite
   ``
   Or, if you already have the project folder, just navigate into it:

   ```bash
   cd path/to/Pokedox-Lite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This installs React, Vite, Tailwind CSS, ESLint, and all other packages listed in `package.json`.

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser. The page hot-reloads on every file save.

### Other Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start local development server with HMR |
| Production build | `npm run build` | Bundle and optimise for deployment into `dist/` |
| Preview build | `npm run preview` | Serve the production build locally |
| Lint | `npm run lint` | Run ESLint across all source files |

---

## 🧠 How It Works

### Data Fetching Strategy

All data comes from the PokéAPI. Three distinct fetch paths are used depending on active filters:

```
Search query active?  → GET /pokemon/{name}          (single result)
Type filter active?   → GET /type/{type}             (all IDs) → batch fetch details
No filters?           → GET /pokemon?offset=N&limit=12 → batch fetch details
```

Batch detail fetches use `Promise.all()` so all 12 cards load in parallel rather than sequentially.

### Debounced Search

The `useDebounce` custom hook delays the search query by **500 ms** before triggering an API call. This prevents a network request on every keystroke and avoids rate-limiting.

```js
const debouncedQuery = useDebounce(query, 500);
```

### Favourites Persistence

Favourites are stored as a JSON array of Pokémon IDs in `localStorage` under the key `poke-favorites`. The initial state is hydrated from storage on first render:

```js
const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('poke-favorites');
  return saved ? JSON.parse(saved) : [];
});
```

### Race Condition Prevention

Each `useEffect` data-fetch returns a cleanup function that sets an `isMounted` flag to `false`. Any async response that arrives after the component unmounts (or after the effect re-runs) is safely discarded:

```js
return () => { isMounted = false; };
```

---

## 🧩 Component Breakdown

| Component | Responsibility |
|---|---|
| `App.jsx` | Global state (pokemons, loading, error, filters, pagination, favourites, selected modal) and all `useEffect` data-fetching |
| `PokemonCard` | Displays sprite, name, types, and favourite heart button |
| `PokemonModal` | Full-screen overlay showing official artwork, physical stats, and animated base-stat progress bars |
| `SearchComponent` | Controlled text input with a search icon |
| `Pagination` | Previous / Next page buttons; disabled at boundaries |
| `Loader` | Animated spinner shown during API requests |
| `useDebounce` | Custom hook that throttles rapidly changing values |

---

## ⚡ Challenges & Solutions

### 1. Vite Not Found (`'vite' is not recognized`)

**Problem:** Running `npm run dev` threw `'vite' is not recognized as an internal or external command`.

**Cause:** The `node_modules` folder was missing — dependencies had never been installed (common when cloning a repo or moving the folder).

**Solution:**
```bash
npm install   # installs all packages from package.json into node_modules
npm run dev   # now works
```

---

### 2. Pagination Jumping on Filter/Search Change

**Problem:** Changing the type filter or entering a search term while on page 5 returned no results because the API was called with `offset=48` against a much smaller dataset.

**Solution:** A dedicated `useEffect` resets `currPage` to `1` whenever the search query or type filter changes:

```js
useEffect(() => {
  setCurrPage(1);
}, [debouncedQuery, selectedType]);
```

---

### 3. Layout Jumping When Fewer Results Load

**Problem:** The pagination bar visually jumped up when a filtered result set had only a few cards (less than a full row).

**Solution:** Applied `min-h-[50vh]` to the content container so the pagination always starts from the same vertical position regardless of card count.

---

### 4. Background Scroll While Modal is Open

**Problem:** The page behind an open Pokémon detail modal was still scrollable, creating a jarring UX.

**Solution:** The `PokemonModal` component uses a `useEffect` cleanup pattern to lock and restore `document.body.style.overflow`:

```js
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = 'auto'; };
}, []);
```

---

### 5. Stale Async Responses on Rapid Filter Changes

**Problem:** Quickly switching types could cause an earlier (slower) API response to overwrite a later (faster) one, showing wrong Pokémon.

**Solution:** The `isMounted` flag pattern ignores any response that arrives after the effect has been cleaned up (i.e., the dependency changed again before the fetch completed).

---

## 🌐 API Reference

This project uses the **PokéAPI v2** — a free, open, and unauthenticated REST API.

| Endpoint | Usage |
|---|---|
| `GET /pokemon?limit=12&offset=N` | Paginated list of all Pokémon |
| `GET /pokemon/{name-or-id}` | Single Pokémon detail by name search |
| `GET /type` | List of all Pokémon types (for the filter dropdown) |
| `GET /type/{type}` | All Pokémon belonging to a specific type |

Full documentation: [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Built with ❤️ as part of the Deepsol Intern Assignment challenge.
