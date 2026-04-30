'use client';

import { GroklyProvider } from './contexts/GroklyContext';

export default function GroklyLayoutClient({ children }) {
  return (
    <GroklyProvider>
      {children}
    </GroklyProvider>
  );
}
