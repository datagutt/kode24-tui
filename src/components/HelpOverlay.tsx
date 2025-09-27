import React from 'react';

interface HelpOverlayProps {
  onClose: () => void;
}

export const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      style={{ backgroundColor: 'black' }}
      flexDirection="column"
      padding={2}
    >
      <text content="Keyboard Shortcuts" style={{ fg: 'cyan', attributes: 1 }} marginBottom={1} />
      
      <box flexDirection="column" gap={1}>
        <text content="Navigation:" style={{ fg: 'yellow' }} />
        <text content="  ↑/↓ - Navigate up/down" />
        <text content="  ←/→ - Navigate left/right (sections)" />
        <text content="  Enter - Select item" />
        <text content="  Esc - Go back" />
        
        <text content="" />
        <text content="Pages:" style={{ fg: 'yellow' }} />
        <text content="  l - Listings" />
        <text content="  t - Tags" />
        <text content="  e - Events" />
        
        <text content="" />
        <text content="General:" style={{ fg: 'yellow' }} />
        <text content="  h - Show/hide this help" />
        <text content="  q - Quit application" />
      </box>
      
      <box marginTop={2} alignSelf="flex-end">
        <text content="Press any key to close" style={{ fg: 'gray' }} />
      </box>
    </box>
  );
};