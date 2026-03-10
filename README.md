# kode24-tui

a terminal user interface for browsing [kode24.no](https://kode24.no) — norway's developer community.

read articles, browse job listings, filter by tags, and check upcoming events, all without leaving your terminal.

built with [react](https://react.dev), [@opentui](https://github.com/anthropics/opentui), and [bun](https://bun.sh).

## install

```sh
bun install
```

## usage

```sh
# development
bun dev

# build standalone binary
bun run build
./kode24
```

cross-compile targets are available:

```sh
bun run build:darwin:arm64   # macOS Apple Silicon
bun run build:darwin:x64     # macOS Intel
bun run build:linux:arm64    # Linux ARM
bun run build:linux:x64      # Linux x64
```

## keyboard shortcuts

| key       | action                              |
| --------- | ----------------------------------- |
| `↑` / `↓` | navigate items                      |
| `Tab`     | switch between main panel & sidebar |
| `Enter`   | open selected article               |
| `Esc`     | go back / close overlay             |
| `t`       | open tag filter                     |
| `c`       | clear active tag filter             |
| `l`       | go to job listings                  |
| `e`       | go to events                        |
| `h`       | toggle help overlay                 |
| `q`       | quit                                |

## project structure

```
src/
├── components/    # reusable UI components (ArticleCard, JobCard, Layout, ...)
├── hooks/         # custom hooks (navigation, scrolling, theming)
├── i18n/          # translations (norwegian)
├── pages/         # page-level views (Frontpage, Article, Listings)
├── schemas/       # zod schemas for API response validation
├── services/      # API client (kode24 + labrador APIs)
├── theme/         # color palette and theme tokens
├── types/         # shared TypeScript types
├── utils/         # HTML-to-TUI rendering utilities
└── index.tsx      # app entry point
```

## tech stack

- **runtime** — bun
- **ui** — react + @opentui (terminal renderer)
- **validation** — zod
- **http** — @better-fetch/fetch with exponential retry
- **html parsing** — cheerio (for article body rendering)
