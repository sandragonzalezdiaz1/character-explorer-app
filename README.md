# Character Explorer App

A responsive Angular application to explore, search, filter, and save your favorite Rick and Morty characters.

The project focuses on modern Angular development practices, reactive programming, API integration, state management, performance optimization, and internationalization.

## Description

Character Explorer App is a responsive Angular application that consumes the [Rick and Morty API](https://rickandmortyapi.com/) to display information about characters from the series.

Users can search characters by name, filter them by status, explore detailed character information, save favorites, and switch between light and dark themes.

The application also preserves active search and filter parameters in the URL, allowing users to navigate between pages without losing their current search state.

## 🖼️ Screenshots

### Character Explorer

![Character Explorer](docs/images/character-explorer.png)

### Character Detail

![Character Detail](docs/images/character-detail.png)

### Favorites

![Favorites](docs/images/favorites.png)

### Dark Mode

![Dark Mode](docs/images/dark-mode.png)

## Features

- Character list with infinite scroll.
- Incremental API loading while scrolling.
- Search characters by name.
- Filter characters by status: alive, dead, unknown, or all.
- Clear all active filters.
- Character detail page.
- Favorite characters saved persistently using `localStorage`.
- Dedicated favorites page available at `/favorites`.
- Image fallback when an avatar can't be loaded.
- Light and dark theme support.
- URL query parameters to preserve active filters and searches.
- Spanish and English support using Angular i18n.
- Responsive interface for different screen sizes.

## Tech Stack

- Angular
- TypeScript
- Angular Signals
- RxJS
- Angular Router
- Angular i18n
- CSS custom properties
- Rick and Morty API
- pnpm

## Technical Highlights

- State management using Angular Signals.
- Reactive search with RxJS, `debounceTime`, and `switchMap`.
- API response caching to reduce unnecessary requests.
- Infinite scrolling with incremental data loading.
- Optimized image loading with priority loading for initial characters.
- Persistent favorites using `localStorage`.
- URL query parameters to preserve filters and search state.
- Internationalization with Angular i18n (Spanish and English)

## Routes

| Route | Description |
| --- | --- |
| `/` | Character explorer with search, filters, and infinite scroll |
| `/character/:id` | Character detail page |
| `/favorites` | Favorite characters page |

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm
- Angular CLI

### Installation

Clone the repository and install the project dependencies:

```bash
pnpm install
```

### Development Server

Run the app in Spanish:

```bash
pnpm start:es
```

Run the app in English:

```bash
pnpm start:en
```

Then open:

```text
http://localhost:4200/
```

## Build

Build the project with:

```bash
pnpm build
```

The build output will be generated in the `dist/` directory.

## Tests

Run the unit tests with:

```bash
pnpm test
```

## API

This project uses the public Rick and Morty API:

```text
https://rickandmortyapi.com/api/character
```

The API provides character information including name, status, species, origin, location, episodes, and images.

## Notes

When many character images are requested in a short period of time, the API or image server may temporarily return a `429 Too Many Requests` response.

The application includes a fallback image mechanism so the interface remains stable when an avatar can't be loaded.
