# kode24-tui Documentation

Welcome to the kode24-tui documentation! This directory contains guides and references for developing with the kode24.no Terminal User Interface.

## 📚 Documentation Index

### **Project Documentation**
- **[Project Overview](../README.md)** - Main project README with setup instructions
- **[Development Guidelines](../AGENTS.md)** - Coding standards and development practices
- **[Project Roadmap](TODO.md)** - Completed features and planned improvements

### **Technical References**
- **[API Reference](API.md)** - kode24.no API endpoints and data structures
- **[Theme System](THEME.md)** - Centralized color/styling system guide
- **[TUI Components](TUI.md)** - OpenTUI React component documentation

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development
bun src/index.tsx

# Type checking
bun run tsc --noEmit
```

## 🎮 Keyboard Controls

| Key | Action |
|-----|--------|
| `q` | Quit application |
| `Esc` | Go back/return to frontpage |
| `↑↓←→` | Navigate |
| `Enter` | Select item |
| `l` | Jump to job listings |
| `t` | Jump to tags |
| `e` | Jump to events |

## 🏗️ Architecture Overview

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (navigation, theme)
├── pages/          # Page components (Article, Frontpage, etc.)
├── schemas/        # Zod validation schemas
├── services/       # API client and external services
├── theme/          # Centralized color/styling system
└── types/          # TypeScript type definitions
```

## 🛠️ Key Technologies

- **Runtime**: Bun + TypeScript
- **UI Framework**: OpenTUI React (terminal-based UI)
- **Validation**: Zod schemas for API responses
- **Styling**: Centralized theme system
- **Navigation**: Custom keyboard-driven routing

## 💡 Development Tips

1. **Use the theme system** for all styling (`useTheme()` hook)
2. **Follow TypeScript patterns** - full type safety required
3. **Test keyboard navigation** after making changes
4. **Update documentation** when adding new features
5. **Run type checking** before committing

---

For detailed information on specific topics, see the individual documentation files listed above.