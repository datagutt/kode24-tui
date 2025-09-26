import React from 'react';

interface ParsedElement {
  type: string;
  content?: string;
  children?: ParsedElement[];
  attributes?: Record<string, string>;
}

function decodeHTMLEntities(text: string): string {
  const entityMap: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };
  
  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return entityMap[entity] || entity;
  });
}

export function parseHTML(html: string): ParsedElement[] {
  // Simple HTML parser for basic elements
  const elements: ParsedElement[] = [];
  let currentPos = 0;
  
  while (currentPos < html.length) {
    const nextTagStart = html.indexOf('<', currentPos);
    
    // Handle text content before next tag
    if (nextTagStart === -1 || nextTagStart > currentPos) {
      const textEnd = nextTagStart === -1 ? html.length : nextTagStart;
      const textContent = html.slice(currentPos, textEnd).trim();
      
      if (textContent) {
        elements.push({
          type: 'text',
          content: textContent
        });
      }
      
      if (nextTagStart === -1) break;
      currentPos = nextTagStart;
    }
    
    // Parse tag
    const tagEnd = html.indexOf('>', currentPos);
    if (tagEnd === -1) break;
    
    const tagContent = html.slice(currentPos + 1, tagEnd);
    const isClosingTag = tagContent.startsWith('/');
    const isSelfClosing = tagContent.endsWith('/');
    
    if (!isClosingTag) {
      const tagName = tagContent.split(/\s/)[0].replace('/', '');
      
      if (isSelfClosing) {
        // Self-closing tag like <br/>
        elements.push({
          type: tagName,
          content: tagName === 'br' ? '\n' : ''
        });
      } else {
        // Find closing tag
        const closingTag = `</${tagName}>`;
        const closingPos = html.indexOf(closingTag, tagEnd);
        
        if (closingPos !== -1) {
          const innerContent = html.slice(tagEnd + 1, closingPos);
          const children = parseHTML(innerContent);
          
          elements.push({
            type: tagName,
            children: children.length > 0 ? children : [{ type: 'text', content: innerContent }]
          });
          
          currentPos = closingPos + closingTag.length;
          continue;
        }
      }
    }
    
    currentPos = tagEnd + 1;
  }
  
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