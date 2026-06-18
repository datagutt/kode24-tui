import { SyntaxStyle } from '@opentui/core';
import { colors } from './colors.js';

// Mirrors the kode24 brand palette the old htmlToOpenTUI walker used, so the
// markdown renderer keeps the same visual language (pink headings/links, teal
// emphasis) instead of a generic theme. Built lazily once and reused: the
// instance owns a native handle that lives for the app's lifetime.
let style: SyntaxStyle | null = null;

export const markdownSyntaxStyle = (): SyntaxStyle =>
  (style ??= SyntaxStyle.fromStyles({
    'markup.heading.1': { fg: colors.accent.pink, bold: true },
    'markup.heading.2': { fg: colors.accent.teal, bold: true },
    'markup.heading.3': { fg: colors.accent.yellow, bold: true },
    'markup.bold': { fg: colors.text.primary, bold: true },
    'markup.strong': { fg: colors.text.primary, bold: true },
    'markup.italic': { fg: colors.accent.teal, italic: true },
    'markup.list': { fg: colors.accent.pink },
    'markup.quote': { fg: colors.accent.teal, italic: true },
    'markup.raw': { fg: colors.text.secondary, bg: colors.background.alt },
    'markup.raw.block': { fg: colors.text.secondary, bg: colors.background.alt },
    'markup.raw.inline': { fg: colors.accent.teal, bg: colors.background.alt },
    'markup.link': { fg: colors.accent.pink, underline: true },
    'markup.link.label': { fg: colors.accent.pink },
    'markup.link.url': { fg: colors.accent.pink, underline: true },
    keyword: { fg: colors.accent.pink, bold: true },
    string: { fg: colors.accent.lime },
    comment: { fg: colors.text.muted, italic: true },
    number: { fg: colors.accent.orange },
    function: { fg: colors.accent.purple },
    type: { fg: colors.accent.orange },
    conceal: { fg: colors.text.muted },
    default: { fg: colors.text.secondary },
  }));
