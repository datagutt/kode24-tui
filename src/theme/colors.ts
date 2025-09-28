/**
 * Centralized theme colors for kode24-tui.
 * Values are derived from kode24-assets SCSS variables to keep the TUI in sync
 * with the real kode24 visual language.
 */

const palette = {
  background: '#131316', // --v2-background
  backgroundHighlight: '#24262e', // --v2-background-highlight
  backgroundAlt: '#1b1c22', // --v2-background-always-dark
  card: '#23252f', // --v2-card-background
  cardRaised: '#353746', // --v2-card-background-highlight
  cardLifted: '#464a5d', // --v2-card-background-highlight-2
  headline: '#f8f8f2', // --v2-card-headline-color
  paragraph: '#a1a3aa', // --v2-card-paragraph-color
  label: '#201f29', // --v2-card-label-background
  teal: '#94ffff', // --v2-label-color-teal
  tealDark: '#00cccc',
  pinkLight: '#ff33a3', // --v2-label-color-pink-lighter
  pink: '#e92b93', // --v2-label-color-pink & buttons
  pinkDark: '#cc0070', // --v2-label-color-pink-darker
  purple: '#b625b6', // --v2-label-color-purple
  purpleDark: '#cc00cc', // --v2-label-color-purple-darker
  lime: '#8aff80', // --v2-label-color-blue (green tone)
  limeDark: '#0d9900', // --v2-label-color-blue-darker
  yellow: '#ffff80', // --v2-label-color-yellow
  yellowDark: '#cccc00', // --v2-label-color-yellow-darker
  orange: '#ffca80', // --v2-label-color-orange
  orangeDark: '#cc7700', // --v2-label-color-orange-darker
  flame: '#ff3300', // --v2-flame-red
};

export const colors = {
  palette,
  background: {
    base: palette.background,
    highlight: palette.backgroundHighlight,
    alt: palette.backgroundAlt,
  },
  surface: {
    card: palette.card,
    raised: palette.cardRaised,
    lifted: palette.cardLifted,
    label: palette.label,
  },
  text: {
    primary: palette.headline,
    secondary: palette.paragraph,
    muted: palette.paragraph,
    inverse: palette.background,
    accent: palette.teal,
  },
  accent: {
    pink: palette.pink,
    pinkLight: palette.pinkLight,
    pinkDark: palette.pinkDark,
    purple: palette.purple,
    purpleDark: palette.purpleDark,
    teal: palette.teal,
    lime: palette.lime,
    yellow: palette.yellow,
    orange: palette.orange,
    flame: palette.flame,
  },
  status: {
    success: palette.lime,
    warning: palette.orange,
    error: palette.pink,
    info: palette.teal,
  },
  border: {
    subtle: palette.cardRaised,
    strong: palette.cardLifted,
  },
} as const;

export const themeColors = {
  header: {
    background: palette.backgroundHighlight,
    text: palette.headline,
    accent: palette.teal,
  },
  footer: {
    background: palette.backgroundAlt,
    text: palette.paragraph,
  },
  navigation: {
    background: palette.background,
    selected: palette.cardRaised,
    selectedText: palette.headline,
    normal: palette.paragraph,
  },
  article: {
    title: palette.headline,
    subtitle: palette.teal,
    author: palette.paragraph,
    date: palette.paragraph,
    reactions: palette.pink,
    comments: palette.teal,
    views: palette.lime,
  },
  job: {
    title: palette.headline,
    company: palette.teal,
    type: palette.yellow,
    location: palette.orange,
    description: palette.paragraph,
    premium: palette.orange,
  },
  tag: {
    name: palette.teal,
    description: palette.paragraph,
    count: palette.yellow,
    selected: palette.cardRaised,
    background: palette.cardRaised,
  },
  status: {
    loading: palette.teal,
    error: palette.pink,
    success: palette.lime,
    warning: palette.orange,
  },
  button: {
    primary: palette.pink,
    primaryText: palette.headline,
    secondary: palette.cardRaised,
    secondaryText: palette.headline,
  },
} as const;

export const colorUtils = {
  get: (path: string): string => {
    const keys = path.split('.');
    let value: any = colors;

    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        console.warn(`Color path '${path}' not found`);
        return palette.headline;
      }
    }

    return value;
  },
  exists: (path: string): boolean => {
    const keys = path.split('.');
    let value: any = colors;

    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return false;
      }
    }

    return typeof value === 'string';
  },
  getPaths: (): string[] => {
    const paths: string[] = [];

    const traverse = (obj: any, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
          paths.push(path);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, path);
        }
      }
    };

    traverse(colors);
    return paths;
  },
};

export type ThemeColorKey = keyof typeof themeColors;

export default {
  colors,
  themeColors,
  colorUtils,
};
