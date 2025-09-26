# Research: Terminal UI Framework Architecture

## Terminal UI Framework Archeture

## Summary

OpenTUI is a sophisticated TypeScript library for building terminal user interfaces (TUIs) with support for React, SolidJS, Vue, and Go. It provides a complete framework for building interactive terminal applications with advanced features like real-time rendering, event handling, layout management, and cross-platform compatibility. For chat applications, SolidJS offers the best performance characteristics due to its fine-grained reactivity and minimal overhead for real-time message streaming.

## Detailed Findings

### Core Architecture and Rendering System

**Dual-Language Architecture**: OpenTUI uses a TypeScript frontend with a high-performance Zig backend for rendering operations. The framework implements sophisticated double buffering with dirty rectangle detection to minimize terminal updates.

- `packages/core/src/renderer.ts:119-138` - Main renderer creation with native Zig integration
- `packages/core/src/zig/renderer.zig:134-225` - Native rendering backend with memory management
- `packages/core/src/zig/buffer.zig:41` - Optimized buffer operations with direct character/color access

**Key Rendering Features**:

- Double buffering with change detection to update only modified cells
- Native ANSI escape sequence generation with run-length optimization
- Terminal capability detection for cross-terminal compatibility
- Threaded output with ping-pong buffers to prevent blocking
- Unicode/grapheme cluster support for complex text rendering

### Component Primitives and Layout System

**Core Renderables**: Built on `BaseRenderable` class extending `packages/core/src/Renderable.ts:254`

- **Box**: Layout container with flexbox, borders, background colors (`packages/core/src/renderables/Box.ts:40-273`)
- **Text**: Rich text with styling, selection, auto-sizing (`packages/core/src/renderables/Text.ts:21`)
- **Input**: Text input with cursor management and validation (`packages/core/src/renderables/Input.ts:26-351`)
- **ScrollBox**: Scrollable containers with scrollbars
- **Select/TabSelect**: Dropdown and tab navigation components
- **Slider**: Range input controls

**Layout Engine**: Yoga layout integration provides flexbox layout with:

- Automatic sizing and positioning calculations
- Margin, padding, and gap support
- Overflow handling (visible, hidden, scroll)
- Z-index layering for complex interfaces

### Input Handling and Event System

**Global Keyboard Management**:

- `packages/core/src/lib/KeyHandler.ts:9-37` - Singleton pattern for terminal raw mode
- `packages/core/src/lib/parse.keypress.ts:108-225` - Comprehensive key parsing with modifier support
- EventEmitter architecture for component communication

**Input Component Features**:

- Real-time validation with INPUT/CHANGE event separation
- Focus management with visual feedback
- Cursor positioning and text selection
- Navigation with arrow keys, home/end, tab cycling

**Mouse Integration**:

- Hit grid system for O(1) mouse event targeting (`packages/core/src/zig/renderer.zig:705-734`)
- Drag-and-drop support with boundary constraints
- Event propagation control with stopPropagation

### Framework Integration Patterns

**React Integration** (`packages/react/`):

- Custom reconciler using React's fiber architecture
- Hooks: `useKeyboard()`, `useRenderer()` for lifecycle management
- State management via useState/useEffect patterns
- JSX with lowercase component names (`<text>`, `<box>`)

**SolidJS Integration** (`packages/solid/`):

- Fine-grained reactivity with signals and stores
- Minimal runtime overhead with compile-time optimization
- Direct signal integration without re-render batching
- Excellent for real-time streaming applications

**Vue Integration** (`packages/vue/`):

- Composition API with ref()/computed() reactivity
- Template-based rendering with {{ }} syntax
- Component names with `Renderable` suffix (`<textRenderable>`)

### Application Examples and Patterns

**Terminal Integration**:

- `packages/core/src/examples/console-demo.ts` - Console-style interface patterns
- Alternate screen mode support for full-screen applications

## Code References

### Core Framework Files

- `packages/core/src/renderer.ts:107` - `createCliRenderer()` main entry point
- `packages/core/src/Renderable.ts:254` - Base renderable class with layout integration
- `packages/core/src/renderables/Input.ts:26` - Text input component with validation
- `packages/core/src/lib/KeyHandler.ts:9` - Global keyboard event handling

### Framework Integrations

- `packages/react/src/reconciler/reconciler.ts:9` - React fiber reconciler
- `packages/solid/src/reconciler.ts:131` - SolidJS universal renderer
- `packages/vue/src/renderer.ts:20` - Vue custom renderer API

### Examples and Patterns

- `packages/core/src/examples/input-demo.ts` - Comprehensive input handling demo
- `packages/solid/examples/session.tsx` - Real-time message streaming example
- `packages/react/examples/counter.tsx` - State management patterns
- `packages/core/src/examples/console-demo.ts` - Terminal interface patterns

## Architecture Insights

**Performance Characteristics**:

- Native Zig backend provides high-performance rendering
- Double buffering minimizes terminal escape sequence output
- Hit grid system enables efficient mouse interaction
- Memory pooling reduces allocation overhead

**Cross-Platform Support**:

- Terminal capability detection adapts to different terminal emulators
- Environment variable overrides for known terminals
- Graceful degradation for unsupported features
- Unicode normalization for consistent text rendering

**Design Patterns**:

- Factory pattern for renderable creation
- Observer pattern for event handling
- Command pattern for batched render operations
- Proxy pattern for VNode method delegation

## Framework Recommendation

**React is the optimal choice** for building the application

1. Use keyboard shortcuts (Ctrl+K for commands, Tab for navigation)

## Related Examples

Key examples to study for chat implementation:

- `packages/react/examples/session.tsx` - Message streaming patterns
- `packages/core/src/examples/input-demo.ts` - Input validation and focus
- `packages/core/src/examples/console-demo.ts` - Terminal interface design
- `packages/react/examples/components/scroll-demo.tsx` - Scrolling behavior
