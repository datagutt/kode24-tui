import React from 'react';
import * as cheerio from 'cheerio';
import { decode } from 'html-entities';

interface ParsedElement {
  type: string;
  content?: string;
  children?: ParsedElement[];
  attributes?: Record<string, string>;
}

function cheerioToParsedElement($el: cheerio.Cheerio<any>): ParsedElement {
  const el = $el[0];
  if (el.type === 'text') {
    return { type: 'text', content: el.data };
  }
  const type = el.name;
  const attributes = el.attribs;
  const children: ParsedElement[] = [];
  $el.contents().each((i: number) => {
    const $child = $el.contents().eq(i);
    children.push(cheerioToParsedElement($child));
  });
  return { type, children: children.length ? children : undefined, attributes };
}

export function parseHTML(html: string): ParsedElement[] {
  const decodedHtml = decode(html);
  const $ = cheerio.load(`<div>${decodedHtml}</div>`);
  const elements: ParsedElement[] = [];
  $('div').contents().each((i: number) => {
    const $el = $('div').contents().eq(i);
    elements.push(cheerioToParsedElement($el));
  });
  return elements;
}

function extractText(element: ParsedElement): string {
  if (element.type === 'text') return element.content ?? '';
  if (element.type === 'br') return '\n';
  if (!element.children) return '';
  return element.children.map(extractText).join('');
}

function isBoldParagraph(element: ParsedElement): boolean {
  const attrs = element.attributes;
  if (!attrs) return false;
  return attrs['data-lab-font_weight']?.includes('bold') || attrs['class']?.includes('font-weight-bold') || false;
}

function isItalicElement(element: ParsedElement): boolean {
  const attrs = element.attributes;
  if (!attrs) return false;
  return attrs['data-lab-italic']?.includes('italic') || attrs['class']?.includes('italic') || false;
}

interface InlinePart {
  text: string;
  fg: string;
  bold: boolean;
}

// Walk an inline element tree, collecting styled text parts.
// <br> inserts a special marker so we can split into lines later.
const BR_MARKER = '\x00BR\x00';

function collectInlineParts(elements: ParsedElement[], fg: string, bold: boolean): InlinePart[] {
  const parts: InlinePart[] = [];

  for (const el of elements) {
    if (el.type === 'text') {
      const t = el.content?.replace(/\s+/g, ' ') ?? '';
      if (t) parts.push({ text: t, fg, bold });
      continue;
    }
    if (el.type === 'br') {
      parts.push({ text: BR_MARKER, fg, bold });
      continue;
    }
    if (el.type === 'strong' || el.type === 'b') {
      if (el.children) parts.push(...collectInlineParts(el.children, '#f8f8f2', true));
      continue;
    }
    if (el.type === 'em' || el.type === 'i') {
      if (el.children) parts.push(...collectInlineParts(el.children, '#94ffff', bold));
      continue;
    }
    if (el.type === 'a') {
      if (el.children) parts.push(...collectInlineParts(el.children, '#e92b93', bold));
      continue;
    }
    if (el.type === 'span') {
      const spanFg = isItalicElement(el) ? '#94ffff' : fg;
      if (el.children) parts.push(...collectInlineParts(el.children, spanFg, bold));
      continue;
    }
    if (el.children) parts.push(...collectInlineParts(el.children, fg, bold));
  }

  return parts;
}

// Split parts at BR_MARKER boundaries into separate lines
function splitAtBreaks(parts: InlinePart[]): InlinePart[][] {
  const lines: InlinePart[][] = [[]];
  for (const part of parts) {
    if (part.text === BR_MARKER) {
      lines.push([]);
    } else if (part.text.includes(BR_MARKER)) {
      const segments = part.text.split(BR_MARKER);
      segments.forEach((seg, i) => {
        if (i > 0) lines.push([]);
        if (seg) lines[lines.length - 1].push({ ...part, text: seg });
      });
    } else {
      lines[lines.length - 1].push(part);
    }
  }
  return lines.filter(line => line.some(p => p.text.trim()));
}

// Render a single line of inline parts as a React node
function renderLine(parts: InlinePart[], key: string): React.ReactNode {
  if (parts.length === 0) return null;

  const allSame = parts.every(p => p.fg === parts[0].fg && p.bold === parts[0].bold);
  if (allSame) {
    const joined = parts.map(p => p.text).join('');
    if (!joined.trim()) return null;
    return (
      <text
        key={key}
        content={joined}
        style={{ fg: parts[0].fg, attributes: parts[0].bold ? 1 : 0 }}
      />
    );
  }

  return (
    <box key={key} style={{ flexDirection: 'row' }}>
      {parts.map((p, i) => (
        <text
          key={i}
          content={p.text}
          style={{ fg: p.fg, attributes: p.bold ? 1 : 0 }}
        />
      ))}
    </box>
  );
}

// Render inline children of a block element (e.g. <p>)
function renderInline(children: ParsedElement[], parentKey: number): React.ReactNode {
  const parts = collectInlineParts(children, '#a1a3aa', false);
  if (parts.length === 0) return null;

  const lines = splitAtBreaks(parts);
  if (lines.length === 0) return null;

  if (lines.length === 1) {
    return renderLine(lines[0], `inline-${parentKey}`);
  }

  // Multiple lines from <br> tags — render as column
  return (
    <box key={`inline-${parentKey}`} style={{ flexDirection: 'column' }}>
      {lines.map((line, i) => renderLine(line, `line-${parentKey}-${i}`))}
    </box>
  );
}

export function htmlElementsToOpenTUI(elements: ParsedElement[]): React.ReactNode[] {
  return elements.map((element, index) => {
    switch (element.type) {
      case 'text': {
        const text = element.content?.replace(/\s+/g, ' ') ?? '';
        if (!text.trim()) return null;
        return <text key={index} content={text} style={{ fg: '#a1a3aa' }} />;
      }

      case 'p': {
        if (!element.children) return null;
        const textContent = extractText(element).trim();
        if (!textContent) return null;

        const bold = isBoldParagraph(element);
        const italic = isItalicElement(element);
        if (bold || italic) {
          return (
            <box key={index} style={{ flexDirection: 'column', marginBottom: 1 }}>
              <text
                content={textContent}
                style={{
                  fg: italic ? '#94ffff' : '#f8f8f2',
                  attributes: bold ? 1 : 0,
                }}
              />
            </box>
          );
        }

        const inline = renderInline(element.children, index);
        if (!inline) return null;
        return (
          <box key={index} style={{ flexDirection: 'column', marginBottom: 1 }}>
            {inline}
          </box>
        );
      }

      case 'h1':
      case 'h2':
      case 'h3': {
        const content = extractText(element).trim();
        if (!content) return null;
        const color = element.type === 'h1' ? '#e92b93' : element.type === 'h2' ? '#94ffff' : '#ffff80';
        return (
          <text
            key={index}
            content={content}
            style={{ fg: color, attributes: 1, marginTop: 2, marginBottom: 1 }}
          />
        );
      }

      case 'ul':
      case 'ol':
        return (
          <box key={index} style={{ flexDirection: 'column', marginLeft: 2, marginBottom: 1, marginTop: 1 }}>
            {element.children?.map((child, i) => {
              if (child.type !== 'li') return null;
              const content = extractText(child).trim();
              if (!content) return null;
              const bullet = element.type === 'ol' ? `${i + 1}. ` : '• ';

              // Use inline rendering for list items to preserve bold/link styling
              const inline = child.children ? renderInline(child.children, i) : null;
              return (
                <box key={i} style={{ flexDirection: 'row', marginBottom: 1 }}>
                  <text content={bullet} style={{ fg: '#e92b93' }} />
                  {inline ?? <text content={content} style={{ fg: '#a1a3aa' }} />}
                </box>
              );
            })}
          </box>
        );

      case 'blockquote': {
        const content = extractText(element).trim();
        if (!content) return null;
        return (
          <box key={index} style={{ marginLeft: 2, marginBottom: 1, marginTop: 1 }}>
            <text content={`│ ${content}`} style={{ fg: '#94ffff' }} />
          </box>
        );
      }

      case 'br':
        return <text key={index} content="" style={{ marginBottom: 1 }} />;

      default:
        if (element.children) {
          const nodes = htmlElementsToOpenTUI(element.children);
          if (nodes.length === 0) return null;
          return <box key={index} style={{ flexDirection: 'column' }}>{nodes}</box>;
        }
        return element.content ? (
          <text key={index} content={element.content} style={{ fg: '#a1a3aa' }} />
        ) : null;
    }
  }).filter(Boolean);
}

export function convertHTMLToOpenTUI(html: string): React.ReactNode[] {
  const elements = parseHTML(html);
  return htmlElementsToOpenTUI(elements);
}
