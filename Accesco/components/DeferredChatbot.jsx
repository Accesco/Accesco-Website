'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AccescoInlineChatbot = dynamic(
  () => import('../app/components/AccescoInlineChatbot'),
  { ssr: false }
);

export default function DeferredChatbot() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => setShouldLoad(true));
      return () => cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setShouldLoad(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) return null;
  return <AccescoInlineChatbot />;
}