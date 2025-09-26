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

export function htmlElementsToOpenTUI(elements: ParsedElement[]): React.ReactNode[] {
  return elements.map((element, index) => {
    switch (element.type) {
      case 'text':
        return element.content ? (
          <text key={index} content={element.content} style={{ fg: 'white' }} />
        ) : null;
        
      case 'p':
        return (
          <box key={index} style={{ flexDirection: 'column', marginBottom: 1 }}>
            {element.children && htmlElementsToOpenTUI(element.children)}
          </box>
        );
        
      case 'h1':
      case 'h2':
      case 'h3':
        return element.children?.[0]?.content ? (
          <text 
            key={index} 
            content={element.children[0].content} 
            style={{ 
              fg: 'cyan', 
              attributes: 1, 
              marginTop: 2, 
              marginBottom: 1 
            }} 
          />
        ) : null;
        
      case 'strong':
      case 'b':
        return element.children?.[0]?.content ? (
          <text 
            key={index} 
            content={element.children[0].content} 
            style={{ fg: 'white', attributes: 1 }} 
          />
        ) : null;
        
      case 'em':
      case 'i':
        return element.children?.[0]?.content ? (
          <text 
            key={index} 
            content={element.children[0].content} 
            style={{ fg: 'yellow' }} 
          />
        ) : null;
        
      case 'ul':
      case 'ol':
        return (
          <box key={index} style={{ flexDirection: 'column', marginLeft: 2, marginBottom: 1 }}>
            {element.children && htmlElementsToOpenTUI(element.children)}
          </box>
        );
        
      case 'li':
        return (
          <box key={index} style={{ flexDirection: 'row', marginBottom: 1 }}>
            <text content="• " style={{ fg: 'blue', marginRight: 1 }} />
            <box style={{ flexDirection: 'column' }}>
              {element.children && htmlElementsToOpenTUI(element.children)}
            </box>
          </box>
        );
        
      case 'br':
        return <text key={index} content="" style={{ marginBottom: 1 }} />;
        
      case 'span':
        // Handle styled spans
        if (element.children?.[0]?.content) {
          return (
            <text 
              key={index} 
              content={element.children[0].content} 
              style={{ fg: 'white' }} 
            />
          );
        }
        return null;
        
      default:
        // For unknown tags, just render their content
        if (element.children) {
          return <box key={index} style={{ flexDirection: 'column' }}>{htmlElementsToOpenTUI(element.children)}</box>;
        }
        return element.content ? (
          <text key={index} content={element.content} style={{ fg: 'white' }} />
        ) : null;
    }
  }).filter(Boolean);
}

export function convertHTMLToOpenTUI(html: string): React.ReactNode[] {
  const elements = parseHTML(html);
  return htmlElementsToOpenTUI(elements);
}