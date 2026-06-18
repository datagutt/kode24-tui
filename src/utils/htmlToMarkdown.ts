import TurndownService from 'turndown';
import { decode } from 'html-entities';

// kode24 stores article bodies as entity-encoded HTML, so decode before turndown
// parses the markup (mirrors the previous cheerio pipeline).
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});

export const htmlToMarkdown = (html: string): string => turndown.turndown(decode(html)).trim();
