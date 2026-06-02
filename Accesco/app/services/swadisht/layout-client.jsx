'use client';

// Force dynamic rendering for all Swadishtt pages  
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Swadishtt Layout
 * @description Layout wrapper for all Swadishtt pages
 */

import { SwadishttProvider } from './contexts/SwadishttContext';

export default function SwadishttLayout({ children }) {
  // Edited Jabez: keep cart state across navigation so checkout sees selected items.
  return <SwadishttProvider>{children}</SwadishttProvider>;
}
