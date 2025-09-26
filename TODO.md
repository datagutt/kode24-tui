# kode24-tui TODO List

## ✅ Completed

### Project Setup & Architecture
- [x] Analyzed existing codebase and API schemas (frontpage.ts, lab.ts)
- [x] Confirmed OpenTUI React installation and dependencies
- [x] Set up TypeScript configuration
- [x] Created production-ready file structure

### Core Infrastructure
- [x] **Types**: `src/types/index.ts` - Centralized type definitions
- [x] **API Service**: `src/services/api.ts` - API calls for frontpage, articles, search, tags
- [x] **Navigation Hook**: `src/hooks/useNavigation.ts` - Page routing and selection state management
- [x] **Layout Component**: `src/components/Layout.tsx` - Consistent page layout with header/footer
- [x] **Frontpage Page**: `src/pages/FrontpagePage.tsx` - Complete frontpage view with sections

### Main Application
- [x] **App Structure**: `src/App.tsx` with navigation system
- [x] **Keyboard Controls**: 
  - q = quit
  - Esc = back/home
  - Arrow keys = navigate
  - Enter = select
  - l = listings shortcut
- [x] **Routing Logic**: Multi-page support with breadcrumb navigation
- [x] **Loading States**: Error handling and loading indicators

## 🔧 In Progress

### TypeScript Integration Issues
- [ ] Fix OpenTUI JSX element recognition
- [ ] Resolve style syntax errors (using wrong OpenTUI style format)
- [ ] Add proper module declarations for OpenTUI React types

## 📋 TODO - High Priority

### Page Implementation
- [ ] **Article Detail Page**: `src/pages/ArticlePage.tsx`
  - Display full article content
  - Show metadata (author, date, tags)
  - Related articles section
  - Comments display
- [ ] **Job Listings Page**: `src/pages/ListingsPage.tsx`
  - Job list with filtering
  - Job detail view
  - Search functionality
- [ ] **Tags/Categories Page**: `src/pages/TagsPage.tsx`
  - Category browser
  - Articles by tag
  - Tag-based filtering

### Navigation Enhancements
- [ ] Implement proper back navigation history
- [ ] Add search functionality across pages
- [ ] Improve keyboard shortcuts documentation
- [ ] Add help/shortcuts overlay (h key)

### Data & API Integration
- [ ] Test all API endpoints with real data
- [ ] Implement proper error handling for API failures
- [ ] Add retry logic for failed requests
- [ ] Cache frequently accessed data

## 📋 TODO - Medium Priority

### User Experience
- [ ] **Loading States**: Better loading animations
- [ ] **Error Handling**: User-friendly error messages
- [ ] **Pagination**: For long lists (articles, jobs)
- [ ] **Search**: Global search functionality
- [ ] **Bookmarks**: Save favorite articles/jobs

### Performance
- [ ] Implement lazy loading for large datasets
- [ ] Add debouncing for search inputs
- [ ] Optimize re-renders in navigation
- [ ] Add data caching layer

### Content Features
- [ ] **Article Reading**: 
  - Full-screen reading mode
  - Text size adjustment
  - Syntax highlighting for code blocks
- [ ] **Job Applications**: Direct application flow
- [ ] **Event Calendar**: Calendar view for events
- [ ] **Comments**: Display and navigation

## 📋 TODO - Low Priority

### Internationalization
- [ ] **i18n Support**: Norwegian/English language switching
- [ ] **Date Formatting**: Locale-specific date formats
- [ ] **Number Formatting**: Norwegian number formats

### Configuration
- [ ] **Settings Page**: User preferences
- [ ] **Theme Support**: Light/dark mode
- [ ] **Keyboard Customization**: Custom key bindings
- [ ] **Cache Settings**: Cache duration preferences

### Advanced Features
- [ ] **Offline Mode**: Cache articles for offline reading
- [ ] **Export**: Save articles to file
- [ ] **RSS Integration**: RSS feed reader
- [ ] **Notifications**: Job alerts, new articles

## 🐛 Known Issues

### Current Bugs
- [ ] OpenTUI TypeScript integration problems
- [ ] Style syntax errors with OpenTUI components
- [ ] JSX elements not properly recognized

### Technical Debt
- [ ] Add comprehensive error boundaries
- [ ] Improve type safety throughout codebase
- [ ] Add unit tests for core functionality
- [ ] Add integration tests for navigation flows

## 🧪 Testing

### Test Coverage Needed
- [ ] **Unit Tests**: 
  - API service functions
  - Navigation hook logic
  - Component rendering
- [ ] **Integration Tests**:
  - Full navigation flows
  - API data integration
  - Keyboard interaction
- [ ] **E2E Tests**:
  - Complete user journeys
  - Performance testing

## 📚 Documentation

### Documentation Tasks
- [ ] **API Documentation**: Document all API endpoints
- [ ] **Component Documentation**: Props and usage examples
- [ ] **User Guide**: How to use the TUI
- [ ] **Developer Guide**: Contributing guidelines
- [ ] **Keyboard Shortcuts**: Complete reference

## 🚀 Release Planning

### MVP (Minimum Viable Product)
- [ ] Fix TypeScript/OpenTUI integration
- [ ] Complete all core pages (Article, Listings, Tags)
- [ ] Test full navigation flow
- [ ] Basic error handling

### v1.0 Release
- [ ] All high priority features
- [ ] Comprehensive testing
- [ ] Documentation complete
- [ ] Performance optimized

### Future Versions
- [ ] i18n support (v1.1)
- [ ] Advanced features (v1.2+)
- [ ] Mobile-specific optimizations (v2.0)

---

## Notes

- **Architecture**: Following production patterns with separation of concerns
- **Technology Stack**: Bun + TypeScript + OpenTUI React + Zod
- **API**: Using existing kode24.no API endpoints
- **Code Style**: Following project guidelines (single functions, minimal destructuring, avoid else/try-catch)

Last Updated: 2025-01-27